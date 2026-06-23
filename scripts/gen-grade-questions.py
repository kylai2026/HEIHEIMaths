# -*- coding: utf-8 -*-
"""Generate p12-questions.js and p56-questions.js"""
import os

OUT = r"C:\Users\user\Desktop\P5-MATHS\js"

P12_TOPICS = {
    'p1-position': ['posLeftRight', 'posUpDown', 'posBetween'],
    'p1-numbers20': ['countObjects', 'compareWithin20', 'orderWithin20'],
    'p1-decompose': ['bondsTo10', 'bondsMake10', 'bondsTeens'],
    'p1-length': ['compareLength', 'longerShorter'],
    'p1-add': ['addWithin10', 'addWithin18', 'addWordSimple'],
    'p1-sub': ['subWithin10', 'subWithin18', 'subWordSimple'],
    'p1-numbers100': ['tensOnes', 'compareWithin100', 'countByTen'],
    'p1-time': ['clockHour', 'clockHalf', 'weekDays'],
    'p1-shapes': ['shapeName', 'shapeSides'],
    'p1-addsub-2d': ['add2dNoCarry', 'add2dCarry', 'sub2dNoBorrow'],
    'p1-money': ['coinValue', 'coinTotal', 'cmMeasure'],
    'p2-hundreds': ['hundredsRead', 'hundredsCompare', 'hundredsOrder'],
    'p2-add': ['add3dNoCarry', 'add3dCarry', 'add3numbers'],
    'p2-sub': ['sub2d', 'sub3d', 'subWord'],
    'p2-angles': ['rightAngle', 'acuteObtuse', 'compareAngles'],
    'p2-direction': ['fourDirections', 'compassDir'],
    'p2-multiply': ['mulTable', 'mulWord', 'mulZeroOne'],
    'p2-time': ['timeMin', 'timeInterval', 'monthDays'],
    'p2-thousands': ['thousandsRead', 'thousandsCompare'],
    'p2-money': ['noteValue', 'moneyChange'],
    'p2-mixed': ['addSubMixed', 'addSubMixedWord'],
    'p2-divide': ['divideBasic', 'divideRemain', 'pictographRead'],
}

P56_TOPICS = {
    'p5-multidigit': ['bigNumRead', 'bigNumCompare', 'roundNumber'],
    'p5-tri-area': ['triArea', 'triAreaWord'],
    'p5-quad-area': ['paraArea', 'trapArea', 'areaWord'],
    'p5-frac-cmp': ['unlikeFracCmp'],
    'p5-frac-addsub': ['unlikeFracAdd', 'unlikeFracSub', 'unlikeFracWord'],
    'p5-frac-mul': ['fracMulInt', 'fracMulFrac', 'fracMulWord'],
    'p5-algebra': ['algebraEval', 'solveEquation', 'equationWord'],
    'p5-circle': ['circleRadius', 'drawCircle'],
    'p5-decimal-mul': ['decMulInt', 'decMulDec', 'decMulWord'],
    'p5-frac-div': ['fracDivInt', 'fracDivFrac', 'fracMixedOps'],
    'p5-volume': ['volumeCalc', 'volumeWord'],
    'p6-decimal-div': ['decDivInt', 'decDivDec', 'decDivWord'],
    'p6-decimal-mixed': ['decFourOps', 'decFourOpsWord'],
    'p6-frac-decimal': ['fracToDec', 'decToFrac', 'fracDecCmp'],
    'p6-average': ['averageCalc', 'averageWord'],
    'p6-percent': ['percentRead', 'fracToPercent', 'decToPercent'],
    'p6-percent-app': ['percentOf', 'percentIncDec'],
    'p6-circumference': ['circumference', 'circumferenceWord'],
    'p6-circle-area': ['circleArea', 'circleAreaWord'],
    'p6-angles-deg': ['angleMeasure', 'angleDraw'],
    'p6-speed': ['speedCalc', 'speedWord'],
    'p6-pie-chart': ['pieChartRead', 'pieChartAngle'],
}

def tier_pools(topics):
    lines = []
    for tid, methods in topics.items():
        easy = methods[:max(1, len(methods)//2)]
        med = methods
        hard = methods[-max(1, len(methods)//2):]
        lines.append(f"    '{tid}': {{ easy: {easy}, medium: {med}, hard: {hard} }},")
    return '\n'.join(lines)

# Read method bodies from template file - we'll embed minimal implementations
print("Topics P12:", len(P12_TOPICS), "P56:", len(P56_TOPICS))
