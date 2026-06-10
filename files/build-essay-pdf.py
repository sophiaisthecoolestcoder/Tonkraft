#!/usr/bin/env python3
"""Regenerate assets/essays/die-tonkraft.pdf — the "Die Tonkraft" essay.

Clean single-column essay on a white page: serif title, italic byline, a
hairline rule, justified prose, and a quiet footer. No coloured banner.
Mirrors the German prose in the bilingual reading view of the essay.

Requires: reportlab (pip) + system Georgia fonts (ships with macOS).
Run from repo root:  python3 files/build-essay-pdf.py
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
)
from reportlab.platypus.flowables import HRFlowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "essays", "die-tonkraft.pdf")

# Brand tokens (css/styles.css :root)
BLUE = HexColor("#1c528a")       # primary
BLUE_DEEP = HexColor("#173f70")  # links
INK = HexColor("#15242c")        # body text
SOFT = HexColor("#4c5b64")       # byline
FAINT = HexColor("#7e8890")      # footer
MIST = HexColor("#c5d6e8")       # hairline

GEO = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEO_B = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
GEO_I = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"
pdfmetrics.registerFont(TTFont("Georgia", GEO))
pdfmetrics.registerFont(TTFont("Georgia-Bold", GEO_B))
pdfmetrics.registerFont(TTFont("Georgia-Italic", GEO_I))

PW, PH = A4
LM = RM = 30 * mm        # generous symmetric margins
TOP = 30 * mm            # top margin (no banner)
FOOT_BASE = 17 * mm      # footer text baseline from page bottom
FOOT_RULE = FOOT_BASE + 22  # hairline sits well above the footer line
FRAME_BOTTOM = FOOT_RULE + 30  # whitespace between body and footer

FOOTER = "Tonkraft — Institut für SaMa Sonologie®"

PARAS = [
    "In seinem Nadabrahma System erklärte Vemu Mukunda, dass nicht alle Menschen "
    "der gleichen tonalen Ordnung folgen, sondern auf einem jeweils eigenen Grundton "
    "gestimmt sind. Dieser Ton bildet den Ausgangspunkt für seine tonale "
    "Innenstruktur, in der alle anderen Töne ihren jeweiligen Platz haben. Jeder "
    "von ihnen kann einen genau abgegrenzten Bereich in Schwingung bringen. In einer "
    "koordinierten Zusammenarbeit können die Töne das gesamte System "
    "„Mensch“ beleben und positiv beeinflussen.",

    "Vemu Mukunda erkannte, dass der menschliche Körper einen Resonanzraum für "
    "insgesamt drei Oktaven hat. Die untere Oktave erstreckt sich von den Füßen "
    "bis zum Nabel, die zweite vom Nabel bis zum Spirituellen Auge an der Stirn, die "
    "dritte Oktave reicht von dort bis zum Scheitelpunkt. Im dazwischen liegenden "
    "Spektrum sind die übrigen Töne lokalisiert. Damit ist der gesamte "
    "menschliche Körper tonal definiert.",

    "Diese Definition bezieht sich aber nicht allein auf den physischen Körper, "
    "sondern betrifft auch die Ebene der Lebensenergie. Gemäß traditionellem "
    "indischen Wissen existieren 72.000 Nadis, das sind feinstoffliche Energiebahnen, "
    "die den menschlichen Körper durchziehen und ihn mit Lebensenergie (Prana) "
    "versorgen. Die wichtigsten Nadis lassen sich ganz natürlich über den "
    "persönlichen Grundton aktivieren.",

    "Der eigentliche Wirkungsbereich der Töne liegt aber auf der Ebene der Gedanken "
    "und Emotionen. Die wichtigsten emotionalen Regungen wie beispielsweise Angst und "
    "Wut, oder auch Neid und Eifersucht, haben ihre eigene Frequenz und können im "
    "Körper genau lokalisiert werden. Die Ursache für eine störende und "
    "andauernde Emotion liegt immer in einem Erlebnis aus der Vergangenheit. Dieses "
    "liegt aber meistens irgendwo im Unbewussten vergraben. In der Anwendung des "
    "Nadabrahma Systems unterliegt die Verwandlung alter Reaktionsmuster nicht einem "
    "therapeutischen Prozess, sondern vollzieht sich einzig durch die Tonkraft der "
    "richtigen Frequenz: Störfelder können neutralisiert werden, ohne dass ihre "
    "Ursache jemals zutage getreten wäre.",

    "Die Wirkung eines Tones liegt in seiner physikalischen Kraft, Ungeordnetes in "
    "funktionale Strukturen umformen zu können, und zwar in dem Moment, wo das "
    "physikalische Gesetz der Resonanz gegeben ist und sich selbst anwendet. Diese "
    "Kraft wurde schon verschiedentlich dokumentiert, meiner Meinung nach am "
    "eindrucksvollsten von Alexander Lauterwasser "
    '(<a href="http://www.foto-lauterwasser.de/" color="#173f70">'
    "www.wasserklangbilder.de</a>). Die dort gezeigten Bilder helfen zu verstehen, "
    "dass ein gesungener Ton im Menschen eine große transformierende Kraft haben "
    "kann, wenn er an dem ihm eigenen Platz eingreift, dem Ort seiner Resonanz. Die in "
    "der Physik des Tons liegende Kraft kann dann dort ein ungeordnetes Durcheinander "
    "in die ihm innewohnende natürliche Ordnung umgestalten. Diesen Vorgang kann "
    "man auch als Gesundung begreifen. Unordnung verwandelt sich in Schönheit, der "
    "Mensch wird heil.",
]

body = ParagraphStyle(
    "body", fontName="Georgia", fontSize=11, leading=17.5,
    alignment=TA_JUSTIFY, textColor=INK, spaceAfter=11, firstLineIndent=0,
)
title = ParagraphStyle(
    "title", fontName="Georgia", fontSize=29, leading=33,
    textColor=BLUE, spaceBefore=0, spaceAfter=5,
)
byline = ParagraphStyle(
    "byline", fontName="Georgia-Italic", fontSize=11, leading=15,
    textColor=SOFT, spaceAfter=15,
)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(MIST)
    canvas.setLineWidth(0.6)
    canvas.line(LM, FOOT_RULE, PW - RM, FOOT_RULE)
    canvas.setFont("Georgia", 8.5)
    canvas.setFillColor(FAINT)
    canvas.drawString(LM, FOOT_BASE, FOOTER)
    canvas.drawRightString(PW - RM, FOOT_BASE, str(doc.page))
    canvas.restoreState()


doc = BaseDocTemplate(
    OUT, pagesize=A4, title="Die Tonkraft", author="Tonkraft Institut",
    subject="Essay", leftMargin=LM, rightMargin=RM,
)
frame = Frame(
    LM, FRAME_BOTTOM, PW - LM - RM, PH - TOP - FRAME_BOTTOM, id="page",
)
doc.addPageTemplates([
    PageTemplate(id="page", frames=[frame], onPage=footer),
])

story = [
    Paragraph("Die Tonkraft", title),
    Paragraph("Ein Essay des Tonkraft Instituts", byline),
    HRFlowable(width="100%", thickness=0.6, color=MIST,
               spaceBefore=0, spaceAfter=20),
]
for p in PARAS:
    story.append(Paragraph(p, body))

doc.build(story)
print("wrote", OUT)
