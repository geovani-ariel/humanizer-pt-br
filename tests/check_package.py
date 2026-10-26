"""Confere integridade do pacote; não avalia a qualidade editorial das saídas."""

import json
import re
from pathlib import Path


def main():
    root = Path(__file__).resolve().parents[1]
    skill = (root / "SKILL.md").read_text(encoding="utf-8")
    if not skill.startswith("---\n") or "\n---\n" not in skill[4:]:
        raise ValueError("SKILL.md sem frontmatter delimitado")
    frontmatter = skill.split("---\n", 2)[1]
    if not re.search(r"^name: humanizer-pt-br$", frontmatter, re.M):
        raise ValueError("Nome da skill ausente ou incompatível")
    version = re.search(r'^  version: "([^"]+)"$', frontmatter, re.M)
    if not version or f"versão {version[1]}" not in (root / "README.md").read_text():
        raise ValueError("Versão ausente ou divergente do README")

    for path in root.rglob("*.md"):
        if ".git" in path.relative_to(root).parts:
            continue
        body = path.read_text(encoding="utf-8")
        for target in re.findall(r"\]\(([^)]+)\)", body):
            if target.startswith(("https://", "http://", "#")):
                continue
            destination = path.parent / target.split("#", 1)[0]
            if not destination.is_file():
                raise ValueError(f"Link local inválido em {path.name}: {target}")

    catalog = (root / "references/padroes-de-revisao.md").read_text()
    numbers = [int(n) for n in re.findall(r"^### (\d+)\.", catalog, re.M)]
    if numbers != list(range(1, 27)):
        raise ValueError("Catálogo deve conter os 26 padrões em ordem")

    cases = json.loads((root / "tests/cases.json").read_text())
    ids = [case["id"] for case in cases]
    if len(ids) != len(set(ids)):
        raise ValueError("Identificadores de caso duplicados")
    for case in cases:
        if not all(isinstance(case.get(key), str) and case[key] for key in ("id", "request")):
            raise ValueError("Caso sem identificador ou pedido textual")
        if "text" in case and not isinstance(case["text"], str):
            raise ValueError(f"Texto inválido: {case['id']}")
        if "samples" in case and not (
            isinstance(case["samples"], list)
            and all(isinstance(sample, str) for sample in case["samples"])
        ):
            raise ValueError(f"Amostras inválidas: {case['id']}")

    license_text = (root / "LICENSE").read_text()
    if "Copyright (c) 2025 Siqi Chen" not in license_text:
        raise ValueError("Aviso original de autoria ausente")
    print(f"Pacote {version[1]} válido: metadados básicos, links locais, catálogo, casos e atribuição.")


if __name__ == "__main__":
    main()
