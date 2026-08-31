#!/usr/bin/env python3
import json
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SECTIONS = [
    {
        "source_dir": "content/fiction",
        "output_file": "data/fiction.json",
        "id_prefix": "fiction",
        "default_category": "Draft",
    },
    {
        "source_dir": "content/reflections",
        "output_file": "data/reflections.json",
        "id_prefix": "reflection",
        "default_category": "Reflection",
    },
    {
        "source_dir": "content/extra",
        "output_file": "data/extra.json",
        "id_prefix": "extra",
        "default_category": "Note",
    },
]


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
        try:
            parsed = json.loads(value.replace("'", '"'))
            if isinstance(parsed, list):
                return [strip_quotes(item) for item in parsed if strip_quotes(item)]
        except json.JSONDecodeError:
            return []

    return [strip_quotes(item) for item in value.split(",") if strip_quotes(item)]


def parse_front_matter(source):
    if not source.startswith("---"):
        return {}, source.strip()

    match = re.match(r"^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$", source)
    if not match:
        return {}, source.strip()

    metadata = {}
    for line in match.group(1).splitlines():
        if ":" not in line:
            continue
        key, raw_value = line.split(":", 1)
        key = key.strip()
        raw_value = raw_value.strip()
        if not key:
            continue
        metadata[key] = parse_tags(raw_value) if key == "tags" else strip_quotes(raw_value)

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
        if file.is_file() and file.suffix.lower() == ".md" and not file.name.startswith(".")
    )


def build_section(section):
    entries = []
    for index, file_path in enumerate(markdown_files(section["source_dir"]), start=1):
        source = file_path.read_text(encoding="utf-8")
        metadata, body = parse_front_matter(source)
        fallback_title = re.sub(r"[-_]+", " ", file_path.stem).strip()
        title = metadata.get("title") or fallback_title
        date = metadata.get("date") or metadata.get("createdAt") or ""
        entry_id = metadata.get("id") or slugify(f"{date}-{title}") or f"{section['id_prefix']}-{index}"

        entries.append(
            {
                "id": entry_id,
                "title": title,
                "category": metadata.get("category") or section["default_category"],
                "tags": metadata.get("tags") if isinstance(metadata.get("tags"), list) else [],
                "createdAt": to_iso_date(date),
                "body": body,
                "sourceFile": str(file_path.relative_to(ROOT)),
            }
        )

    entries.sort(key=lambda entry: (entry["createdAt"], entry["title"]), reverse=True)
    output_path = ROOT / section["output_file"]
    output_path.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return section["output_file"], len(entries)


def main():
    for section in SECTIONS:
        output_file, count = build_section(section)
        suffix = "y" if count == 1 else "ies"
        print(f"{output_file}: {count} entr{suffix}")


if __name__ == "__main__":
    main()
