#!/usr/bin/env python3
"""Microscope oracle: independent python recompute of the optics math."""
import json, os

def optics(obj, na, eye, lam, fn):
    if not (obj > 0 and na > 0 and eye > 0 and lam > 0 and fn > 0): return None
    total = obj * eye
    res = 0.61 * lam / na / 1000
    fov = fn / obj
    dof = lam / (na * na) / 1000
    bmin, bmax = round(500 * na), round(1000 * na)
    return {'totalMag': total, 'resolutionUm': round(res, 3), 'fovMm': round(fov, 2),
            'dofUm': round(dof, 2), 'usefulMin': bmin, 'usefulMax': bmax,
            'empty': total > bmax, 'belowBand': total < bmin}

def maxpix(res, cam):
    if not (res > 0 and cam > 0): return None
    return round(res * cam / 2, 2)

cases = []
for a in [(4,0.10,10,550,20),(10,0.25,10,550,20),(40,0.65,10,550,22),(100,1.25,10,550,20),
          (100,1.25,16,550,20),(60,0.85,10,530,22),(20,0.40,10,550,26.5),(0,0.5,10,550,20),
          (40,0,10,550,20),(40,0.65,10,0,20),(100,1.30,15,450,18)]:
    cases.append({'kind':'optics','args':list(a),'oracle':optics(*a)})
for a in [(0.268,0.5),(0.35,1.0),(0.5,0),(0,0.5),(0.18,0.63)]:
    cases.append({'kind':'maxpix','args':list(a),'oracle':maxpix(*a)})

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'expected.json')
json.dump({'items': cases}, open(out,'w'))
print('cases:', len(cases))
