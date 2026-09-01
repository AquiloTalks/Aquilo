#!/usr/bin/env python3
import json
import re
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

LIST_FIELDS = {"tags", "readDates", "relatedBooks"}
LANGUAGES = {"en", "zh"}

SECTIONS = [
    {
        "name": "fiction",
        "source_dir": "content/fiction",
        "output_file": "data/fiction.json",
        "id_prefix": "fiction",
        "default_category": "Draft",
    },
    {
        "name": "reflections",
        "source_dir": "content/reflections",
        "output_file": "data/reflections.json",
        "id_prefix": "reflection",
        "default_category": "Reflection",
    },
    {
        "name": "extra",
        "source_dir": "content/extra",
        "output_file": "data/extra.json",
        "id_prefix": "extra",
        "default_category": "Note",
    },
]

LIBRARY_SECTION = {
    "name": "library",
    "source_dir": "content/library",
    "output_file": "data/books.json",
}


def slugify(value):
    normalized = unicodedata.normalize("NFKD", str(value))
    ascii_value = "".join(char for char in normalized if not unicodedata.combining(char))
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_value.lower())
    return slug.strip("-")


def strip_quotes(value):
    value = str(value).strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def parse_tags(value):
    value = str(value).strip()
    if not value:
        return []

    if value.startswith("[") and value.endswith("]"):
        inner_value = value[1:-1].strip()
        try:
            parsed = json.loads(value.replace("'", '"'))
            if isinstance(parsed, list):
                return [strip_quotes(item) for item in parsed if strip_quotes(item)]
        except json.JSONDecodeError:
            return [strip_quotes(item) for item in inner_value.split(",") if strip_quotes(item)]

    return [strip_quotes(item) for item in value.split(",") if strip_quotes(item)]


def parse_front_matter(source):
    if not source.startswith("---"):
        return {}, source.strip()

    match = re.match(r"^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$", source)
    if not match:
        return {}, source.strip()

    metadata = {}
    lines = match.group(1).splitlines()
    index = 0
    while index < len(lines):
        line = lines[index]
        if ":" not in line:
            index += 1
            continue
        key, raw_value = line.split(":", 1)
        key = key.strip()
        raw_value = raw_value.strip()
        if not key:
            index += 1
            continue
        if raw_value == "|":
            index += 1
            block_lines = []
            while index < len(lines):
                next_line = lines[index]
                if next_line and not next_line.startswith((" ", "\t")) and ":" in next_line:
                    break
                block_lines.append(next_line[2:] if next_line.startswith("  ") else next_line.lstrip("\t"))
                index += 1
            metadata[key] = "\n".join(block_lines).strip()
            continue
        metadata[key] = parse_tags(raw_value) if key in LIST_FIELDS else strip_quotes(raw_value)
        index += 1

    return metadata, match.group(2).strip()


def to_iso_date(value):
    if not value:
        return "1970-01-01T00:00:00.000Z"

    value = str(value).strip()
    try:
        if re.match(r"^\d{4}-\d{2}-\d{2}$", value):
            parsed = datetime.fromisoformat(value).replace(tzinfo=timezone.utc)
        else:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            parsed = parsed.astimezone(timezone.utc)
        return parsed.isoformat(timespec="milliseconds").replace("+00:00", "Z")
    except ValueError:
        return "1970-01-01T00:00:00.000Z"


def markdown_files(source_dir):
    directory = ROOT / source_dir
    return sorted(
        file
        for file in directory.iterdir()
        if file.is_file() and file.suffix.lower() == ".md" and not file.name.startswith((".", "_"))
    )


def split_language_suffix(file_path):
    stem = file_path.stem
    if "." not in stem:
        return stem, ""
    base, language = stem.rsplit(".", 1)
    if language in LANGUAGES:
        return base, language
    return stem, ""


def source_file(file_path):
    return str(file_path.relative_to(ROOT))


def list_value(metadata, key):
    value = metadata.get(key)
    return value if isinstance(value, list) else []


def write_json(output_file, entries):
    output_path = ROOT / output_file
    output_path.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def entry_suffix(count):
    return "y" if count == 1 else "ies"


def choose_default_version(versions):
    return versions.get("default") or versions.get("en") or versions.get("zh") or next(iter(versions.values()))


def group_markdown_files(source_dir):
    grouped = {}
    for file_path in markdown_files(source_dir):
        base, language = split_language_suffix(file_path)
        grouped.setdefault(base, {})[language or "default"] = file_path
    return grouped


def read_markdown_entry(file_path, section):
    source = file_path.read_text(encoding="utf-8")
    metadata, body = parse_front_matter(source)
    fallback_title = re.sub(r"[-_]+", " ", split_language_suffix(file_path)[0]).strip()
    title = metadata.get("title") or fallback_title
    date = metadata.get("date") or metadata.get("createdAt") or ""
    return {
        "file_path": file_path,
        "metadata": metadata,
        "title": title,
        "category": metadata.get("category") or section["default_category"],
        "tags": metadata.get("tags") if isinstance(metadata.get("tags"), list) else [],
        "createdAt": to_iso_date(date),
        "body": body,
    }


def build_section(section):
    grouped = {
        base: {
            language: read_markdown_entry(file_path, section)
            for language, file_path in versions.items()
        }
        for base, versions in group_markdown_files(section["source_dir"]).items()
    }

    entries = []
    for index, (base, versions) in enumerate(sorted(grouped.items()), start=1):
        default = choose_default_version(versions)
        metadata = default["metadata"]
        entry_id = metadata.get("id") or base or f"{section['id_prefix']}-{index}"
        source_files = [
            source_file(version["file_path"])
            for _, version in sorted(versions.items())
        ]
        translations = {
            language: {
                "title": version["title"],
                "category": version["category"],
                "body": version["body"],
            }
            for language, version in versions.items()
            if language in LANGUAGES
        }
        entries.append(
            {
                "id": entry_id,
                "title": default["title"],
                "category": default["category"],
                "tags": list_value(metadata, "tags"),
                "createdAt": default["createdAt"],
                "body": default["body"],
                "sourceFile": source_files[0],
                "sourceFiles": source_files,
            }
        )
        if translations:
            entries[-1]["translations"] = translations

    entries.sort(key=lambda entry: (entry["createdAt"], entry["title"]), reverse=True)
    write_json(section["output_file"], entries)
    return section["output_file"], len(entries)


def normalize_book_id(value, fallback):
    if value in {None, ""}:
        return fallback
    value = strip_quotes(value)
    return int(value) if re.match(r"^\d+$", value) else value


def build_library(section):
    grouped = group_markdown_files(section["source_dir"])

    entries = []
    for index, (base, versions) in enumerate(sorted(grouped.items()), start=1):
        file_path = choose_default_version(versions)
        source = file_path.read_text(encoding="utf-8")
        metadata, body = parse_front_matter(source)
        fallback_title = re.sub(r"[-_]+", " ", split_language_suffix(file_path)[0]).strip()
        title = metadata.get("title") or fallback_title
        author_info = {
            "nationality": metadata.get("authorNationality", ""),
            "genre": metadata.get("authorGenre", ""),
            "knownFor": metadata.get("authorKnownFor", ""),
        }
        source_files = [
            source_file(version)
            for _, version in sorted(versions.items())
        ]
        translations = {}
        for language, version_path in versions.items():
            if language not in LANGUAGES:
                continue
            version_source = version_path.read_text(encoding="utf-8")
            version_metadata, version_body = parse_front_matter(version_source)
            translations[language] = {
                "title": version_metadata.get("title") or title,
                "author": version_metadata.get("author") or metadata.get("author", ""),
                "mood": version_metadata.get("mood", ""),
                "why": version_metadata.get("why", ""),
                "favoriteQuote": version_metadata.get("favoriteQuote", ""),
                "keyThemes": version_metadata.get("keyThemes", ""),
                "literaryContext": version_metadata.get("literaryContext", ""),
                "personalReview": version_metadata.get("personalReview") or version_body,
            }

        entries.append(
            {
                "id": normalize_book_id(metadata.get("id"), index),
                "title": title,
                "author": metadata.get("author", ""),
                "year": metadata.get("year", ""),
                "status": metadata.get("status", "unread"),
                "readDates": list_value(metadata, "readDates"),
                "mood": metadata.get("mood", ""),
                "tags": list_value(metadata, "tags"),
                "why": metadata.get("why", ""),
                "favoriteQuote": metadata.get("favoriteQuote", ""),
                "keyThemes": metadata.get("keyThemes", ""),
                "literaryContext": metadata.get("literaryContext", ""),
                "personalReview": metadata.get("personalReview") or body,
                "relatedBooks": list_value(metadata, "relatedBooks"),
                "authorInfo": {key: value for key, value in author_info.items() if value},
                "sourceFile": source_files[0],
                "sourceFiles": source_files,
            }
        )
        if translations:
            entries[-1]["translations"] = translations

    write_json(section["output_file"], entries)
    return section["output_file"], len(entries)


def main():
    selected = set(sys.argv[1:])
    run_all = not selected

    if run_all or "library" in selected:
        library_dir = ROOT / LIBRARY_SECTION["source_dir"]
        if library_dir.exists() and any(markdown_files(LIBRARY_SECTION["source_dir"])):
            output_file, count = build_library(LIBRARY_SECTION)
            print(f"{output_file}: {count} entr{entry_suffix(count)}")

    for section in SECTIONS:
        if not run_all and section["name"] not in selected:
            continue
        output_file, count = build_section(section)
        print(f"{output_file}: {count} entr{entry_suffix(count)}")


if __name__ == "__main__":
    main()
