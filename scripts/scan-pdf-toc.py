# -*- coding: utf-8 -*-
import fitz
import os
import json
import re

BASE = r"G:\共用雲端硬碟\心光數學教學資源\小學\電子書(參考)"

BOOKS = [
    ("P1", "小一", "1上A"), ("P1", "小一", "1上B"), ("P1", "小一", "1下A"), ("P1", "小一", "1下B"),
    ("P2", "小二", "2上A"), ("P2", "小二", "2上B"), ("P2", "小二", "2下A"), ("P2", "小二", "2下B"),
    ("P5", "小五", "5上A"), ("P5", "小五", "5上B"), ("P5", "小五", "5下A"), ("P5", "小五", "5下B"),
    ("P6", "小六", "6上A"), ("P6", "小六", "6上B"), ("P6", "小六", "6下A"), ("P6", "小六", "6下B"),
]

def grade_folder(grade_cn):
    return grade_cn

def extract_toc(pdf_path, max_pages_text=8):
    result = {"path": pdf_path, "toc": [], "headings": [], "sample_text": ""}
    if not os.path.exists(pdf_path):
        result["error"] = "not found"
        return result
    doc = fitz.open(pdf_path)
    result["pages"] = doc.page_count
    # TOC
    toc = doc.get_toc()
    for item in toc:
        level, title, page = item[0], item[1].strip(), item[2]
        if title:
            result["toc"].append({"level": level, "title": title, "page": page})
    # scan first pages for chapter patterns
    text_parts = []
    for i in range(min(max_pages_text, doc.page_count)):
        text_parts.append(doc.load_page(i).get_text())
    full = "\n".join(text_parts)
    result["sample_text"] = full[:3000]
    # common patterns in HK math books
    patterns = [
        r"第[一二三四五六七八九十百]+課[\s·:：]*(.{2,20})",
        r"單元[一二三四五六七八九十\d]+[\s·:：]*(.{2,20})",
        r"課題[一二三四五六七八九十\d]+[\s·:：]*(.{2,20})",
    ]
    headings = set()
    for pat in patterns:
        for m in re.finditer(pat, full):
            headings.add(m.group(0).strip()[:40])
    result["headings"] = sorted(headings)[:30]
    doc.close()
    return result

out = {}
for grade, folder, book in BOOKS:
    pdf = os.path.join(BASE, folder, f"{book}.pdf")
    key = f"{grade}/{book}"
    print(f"Scanning {key}...")
    out[key] = extract_toc(pdf)

out_path = r"C:\Users\user\Desktop\P5-MATHS\scripts\pdf-toc-scan.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print("Wrote", out_path)
