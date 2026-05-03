from html import escape
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "PROJECT_REPORT.md"
TARGET = ROOT / "Movie_Ticketing_App_Report.html"


def inline(text):
    text = escape(text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    return text


def is_table_line(line):
    return line.startswith("|") and line.endswith("|")


def table_row(line):
    return [cell.strip() for cell in line.strip("|").split("|")]


def render_table(lines):
    header = table_row(lines[0])
    body = [table_row(line) for line in lines[2:]]
    html = ["<table>", "<thead><tr>"]
    for cell in header:
        html.append(f"<th>{inline(cell)}</th>")
    html.append("</tr></thead><tbody>")
    for row in body:
        html.append("<tr>")
        for cell in row:
            html.append(f"<td>{inline(cell)}</td>")
        html.append("</tr>")
    html.append("</tbody></table>")
    return "\n".join(html)


def convert_markdown(markdown):
    lines = markdown.splitlines()
    out = []
    i = 0
    in_ul = False
    in_ol = False
    in_pre = False
    pre_lines = []

    def close_lists():
        nonlocal in_ul, in_ol
        if in_ul:
            out.append("</ul>")
            in_ul = False
        if in_ol:
            out.append("</ol>")
            in_ol = False

    while i < len(lines):
        line = lines[i].rstrip()

        if line.startswith("```"):
            if in_pre:
                out.append(f"<pre>{escape(chr(10).join(pre_lines))}</pre>")
                pre_lines = []
                in_pre = False
            else:
                close_lists()
                in_pre = True
            i += 1
            continue

        if in_pre:
            pre_lines.append(line)
            i += 1
            continue

        if not line.strip():
            close_lists()
            i += 1
            continue

        if is_table_line(line) and i + 1 < len(lines) and is_table_line(lines[i + 1]):
            close_lists()
            table_lines = [line, lines[i + 1].rstrip()]
            i += 2
            while i < len(lines) and is_table_line(lines[i].rstrip()):
                table_lines.append(lines[i].rstrip())
                i += 1
            out.append(render_table(table_lines))
            continue

        if line.startswith("# "):
            close_lists()
            out.append(f"<h1>{inline(line[2:].strip())}</h1>")
        elif line.startswith("## "):
            close_lists()
            out.append(f"<h2>{inline(line[3:].strip())}</h2>")
        elif line.startswith("### "):
            close_lists()
            out.append(f"<h3>{inline(line[4:].strip())}</h3>")
        elif line.startswith("- "):
            if not in_ul:
                close_lists()
                out.append("<ul>")
                in_ul = True
            out.append(f"<li>{inline(line[2:].strip())}</li>")
        elif re.match(r"^\d+\.\s+", line):
            if not in_ol:
                close_lists()
                out.append("<ol>")
                in_ol = True
            item_text = re.sub(r"^\d+\.\s+", "", line)
            out.append(f"<li>{inline(item_text)}</li>")
        else:
            close_lists()
            out.append(f"<p>{inline(line)}</p>")

        i += 1

    close_lists()
    return "\n".join(out)


body = convert_markdown(SOURCE.read_text(encoding="utf-8"))

html = f"""<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Movie Ticketing App Report</title>
<style>
  body {{
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
    line-height: 1.42;
    margin: 48px 58px;
    font-size: 11pt;
  }}
  h1 {{
    color: #0f3d5e;
    font-size: 26pt;
    margin: 0 0 18px 0;
    padding-bottom: 10px;
    border-bottom: 3px solid #0f766e;
  }}
  h2 {{
    color: #0f3d5e;
    font-size: 17pt;
    margin: 24px 0 10px 0;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 5px;
  }}
  h3 {{
    color: #0f766e;
    font-size: 13pt;
    margin: 18px 0 8px 0;
  }}
  p {{
    margin: 7px 0 9px 0;
  }}
  ul, ol {{
    margin: 6px 0 10px 24px;
  }}
  li {{
    margin: 3px 0;
  }}
  code {{
    font-family: Menlo, Consolas, monospace;
    background: #eef2f7;
    color: #111827;
    padding: 1px 4px;
    border-radius: 3px;
  }}
  pre {{
    font-family: Menlo, Consolas, monospace;
    background: #f3f6f8;
    border-left: 4px solid #0f766e;
    padding: 10px 12px;
    white-space: pre-wrap;
    margin: 10px 0 12px 0;
  }}
  table {{
    border-collapse: collapse;
    width: 100%;
    margin: 9px 0 16px 0;
    font-size: 9.5pt;
  }}
  th {{
    background: #0f3d5e;
    color: white;
    font-weight: bold;
  }}
  th, td {{
    border: 1px solid #cbd5e1;
    padding: 7px 8px;
    vertical-align: top;
  }}
  tr:nth-child(even) td {{
    background: #f8fafc;
  }}
</style>
</head>
<body>
{body}
</body>
</html>
"""

TARGET.write_text(html, encoding="utf-8")
