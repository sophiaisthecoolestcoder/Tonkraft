#!/usr/bin/env python3
"""Regenerate assets/essays/die-tonkraft.pdf — the "Die Tonkraft" essay.

White page background, Georgia serif, brand-blue masthead band, justified prose.
Mirrors the German prose in essays/die-tonkraft.html (the bilingual reading view).

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
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, NextPageTemplate,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "essays", "die-tonkraft.pdf")

# Brand tokens (css/styles.css :root)
BLUE = HexColor("#1c528a")       # primary
BLUE_DEEP = HexColor("#173f70")  # links
INK = HexColor("#15242c")        # body text
FAINT = HexColor("#7e8890")      # footer
MIST = HexColor("#c5d6e8")       # hairline

GEO = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEO_B = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
GEO_I = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"
pdfmetrics.registerFont(TTFont("Georgia", GEO))
pdfmetrics.registerFont(TTFont("Georgia-Bold", GEO_B))
pdfmetrics.registerFont(TTFont("Georgia-Italic", GEO_I))

PW, PH = A4
LM = RM = 24 * mm
BAND_H = 19 * mm
FOOT_Y = 16 * mm

KICKER = "TONKRAFT  ·  INSTITUT FÜR SONOLOGIE"
FOOTER = "Tonkraft — Institut für Sonologie"

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
    alignment=TA_JUSTIFY, textColor=INK, spaceAfter=11,
)
title = ParagraphStyle(
    "title", fontName="Georgia", fontSize=30, leading=34,
    textColor=BLUE, spaceBefore=0, spaceAfter=20,
)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(MIST)
    canvas.setLineWidth(0.6)
    canvas.line(LM, FOOT_Y + 9, PW - RM, FOOT_Y + 9)
    canvas.setFont("Georgia", 8.5)
    canvas.setFillColor(FAINT)
    canvas.drawString(LM, FOOT_Y, FOOTER)
    canvas.drawRightString(PW - RM, FOOT_Y, str(doc.page))
    canvas.restoreState()


def first_page(canvas, doc):
    canvas.saveState()
    # full-bleed brand band
    canvas.setFillColor(BLUE)
    canvas.rect(0, PH - BAND_H, PW, BAND_H, stroke=0, fill=1)
    to = canvas.beginText(LM, PH - BAND_H + (BAND_H - 9) / 2 + 1)
    to.setFont("Georgia", 9)
    to.setCharSpace(1.6)
    to.setFillColor(HexColor("#ffffff"))
    to.textOut(KICKER)
    canvas.drawText(to)
    canvas.restoreState()
    footer(canvas, doc)


def later_page(canvas, doc):
    footer(canvas, doc)


doc = BaseDocTemplate(
    OUT, pagesize=A4, title="Die Tonkraft", author="Tonkraft Institut",
    subject="Essay", leftMargin=LM, rightMargin=RM,
)
frame_first = Frame(
    LM, FOOT_Y + 18, PW - LM - RM,
    PH - BAND_H - 14 * mm - (FOOT_Y + 18), id="first",
)
frame_later = Frame(
    LM, FOOT_Y + 18, PW - LM - RM,
    PH - 24 * mm - (FOOT_Y + 18), id="later",
)
doc.addPageTemplates([
    PageTemplate(id="first", frames=[frame_first], onPage=first_page),
    PageTemplate(id="later", frames=[frame_later], onPage=later_page),
])

story = [
    NextPageTemplate("later"),
    Paragraph("Die Tonkraft", title),
]
for p in PARAS:
    story.append(Paragraph(p, body))

doc.build(story)
print("wrote", OUT)
