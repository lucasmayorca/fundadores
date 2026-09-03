#!/usr/bin/env python3
"""Genera el arte que no puede vivir en SVG: icono.png y img/og.png.

Todo lo demás del juego se dibuja en arte.js, que es SVG y toma el ámbar del
token. Estos dos no pueden: el ícono de "añadir a pantalla de inicio" y la
tarjeta social que leen los crawlers de LinkedIn, Slack y Twitter tienen que
ser un archivo raster o no se muestran.

Los dos dibujan lo mismo: las ocho torres del ESCALAFON — la altura de cada
una ES el mando del puesto, de 12% a 100% — con un camino de ventanas
encendidas que sube de la más baja a la más alta. Es la escalera de la portada
mirada de noche.

Sin dependencias: PNG escrito a mano con struct + zlib, igual que hacía
make_icono.py, al que reemplaza. Correr con:

    python3 make_arte.py
"""
import math
import os
import struct
import zlib

BG     = (0x0a, 0x0b, 0x0d)
BORDE  = (0xe7, 0xe6, 0xe2)
VIDRIO = (0x3a, 0x3d, 0x44)
AMBAR  = (0xff, 0xb4, 0x54)
CAMINO = (0x96, 0x6b, 0x30)
MEDIO  = (0x6b, 0x6f, 0x76)

# El mando real de cada puesto del ESCALAFON (ver sectores.js). No es una
# curva decorativa: es el mismo dato que dibuja la escalera de la portada.
MANDO = [0.12, 0.20, 0.32, 0.46, 0.62, 0.80, 0.92, 1.0]


class Lienzo(object):
    """Un búfer RGB con lo mínimo para dibujar rectángulos y líneas."""

    def __init__(self, w, h, fondo):
        self.w, self.h = w, h
        self.px = bytearray(bytes(fondo) * (w * h))

    def punto(self, x, y, color):
        x, y = int(x), int(y)
        if 0 <= x < self.w and 0 <= y < self.h:
            i = (y * self.w + x) * 3
            self.px[i:i + 3] = bytes(color)

    def caja(self, x0, y0, x1, y1, color):
        for y in range(int(y0), int(y1)):
            for x in range(int(x0), int(x1)):
                self.punto(x, y, color)

    def marco(self, x0, y0, x1, y1, color, grosor):
        self.caja(x0, y0, x1, y0 + grosor, color)
        self.caja(x0, y1 - grosor, x1, y1, color)
        self.caja(x0, y0, x0 + grosor, y1, color)
        self.caja(x1 - grosor, y0, x1, y1, color)

    def linea(self, x0, y0, x1, y1, color, grosor=1):
        pasos = int(max(abs(x1 - x0), abs(y1 - y0))) + 1
        for i in range(pasos + 1):
            t = i / float(pasos)
            x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            for gy in range(grosor):
                for gx in range(grosor):
                    self.punto(x + gx, y + gy, color)

    def guardar(self, destino):
        filas = []
        for y in range(self.h):
            i = y * self.w * 3
            filas.append(b'\x00' + bytes(self.px[i:i + self.w * 3]))
        crudo = zlib.compress(b''.join(filas), 9)

        def trozo(tipo, datos):
            c = tipo + datos
            return (struct.pack('>I', len(datos)) + c +
                    struct.pack('>I', zlib.crc32(c) & 0xffffffff))

        png = (b'\x89PNG\r\n\x1a\n' +
               trozo(b'IHDR', struct.pack('>IIBBBBB', self.w, self.h, 8, 2, 0, 0, 0)) +
               trozo(b'IDAT', crudo) +
               trozo(b'IEND', b''))
        with open(destino, 'wb') as f:
            f.write(png)
        return len(png)


def ruido(a, b):
    """La misma función que usa ui.js: azar con semilla fija, así el cielo es
    idéntico en cada corrida y el PNG no cambia sin motivo."""
    s = math.sin(a * 12.9898 + b * 78.233) * 43758.5453
    return s - math.floor(s)


def ciudad(w, h, base, x0, ancho, hueco, altmax, grosor):
    c = Lienzo(w, h, BG)

    # el cielo de las 3am del que habla la dirección visual
    for i in range(70):
        sx, sy = ruido(i, 3.1) * w, ruido(i, 7.7) * base * 0.52
        r = 2 if ruido(i, 2.2) > 0.82 else 1
        c.caja(sx, sy, sx + r, sy + r, VIDRIO)

    mx, my, mr = w * 0.10, base * 0.16, altmax * 0.075
    for ang in range(0, 3600):
        a = ang * math.pi / 1800
        c.punto(mx + math.cos(a) * mr, my + math.sin(a) * mr, MEDIO)
        c.punto(mx + math.cos(a) * mr + 1, my + math.sin(a) * mr, MEDIO)
    # el gajo que convierte el círculo en luna creciente
    for ang in range(0, 3600):
        a = ang * math.pi / 1800
        for rr in range(int(mr * 1.25)):
            c.punto(mx + mr * 0.55 + math.cos(a) * rr, my + math.sin(a) * rr, BG)

    camino = []
    for i in range(8):
        alt = altmax * (0.14 + MANDO[i] * 0.86)
        x, y = x0 + i * (ancho + hueco), base - alt
        c.marco(x, y, x + ancho, base, BORDE, grosor)

        vw, vh = ancho * 0.115, alt * 0.038
        filas = max(2, int(alt / (vh * 3.4)))
        for j in range(5):
            for k in range(filas):
                wx = x + ancho * 0.085 + j * (ancho * 0.176)
                wy = y + alt * 0.055 + k * (vh * 3.4)
                if wy + vh > base - alt * 0.05:
                    continue
                c.caja(wx, wy, wx + vw, wy + vh, VIDRIO)

        # la ventana encendida va siempre en la segunda fila desde arriba: así
        # el camino sube monótono y se lee como escalera, no como serrucho
        lx = x + ancho * 0.085 + min(4, i % 5) * (ancho * 0.176)
        ly = y + alt * 0.055 + (1 if filas > 2 else 0) * (vh * 3.4)
        c.caja(lx, ly, lx + vw, ly + vh, AMBAR)
        camino.append((lx + vw / 2, ly + vh / 2))

    for i in range(len(camino) - 1):
        c.linea(camino[i][0], camino[i][1], camino[i + 1][0], camino[i + 1][1], CAMINO, grosor)

    # la bandera en la torre del fundador
    fx, fy = x0 + 7 * (ancho + hueco) + ancho * 0.80, base - altmax
    c.caja(fx, fy - altmax * 0.115, fx + grosor, fy, BORDE)
    for paso in range(int(altmax * 0.06)):
        t = paso / max(1.0, altmax * 0.06)
        c.caja(fx, fy - altmax * 0.115 + paso, fx + ancho * 0.30 * (1 - t * 0.35), fy - altmax * 0.115 + paso + 1, AMBAR)

    c.caja(0, base, w, base + grosor, MEDIO)
    return c


def marca(lado):
    """El ícono: la escalera reducida a lo mínimo que todavía se lee a 32px."""
    c = Lienzo(lado, lado, BG)
    x0, ancho, hueco, base, altmax = 78, 34, 10, 400, 290
    for i in range(8):
        alt = altmax * (0.16 + MANDO[i] * 0.84)
        x = x0 + i * (ancho + hueco)
        if i == 7:
            c.caja(x, base - alt, x + ancho, base, AMBAR)
        else:
            c.marco(x, base - alt, x + ancho, base, BORDE, 5)
    return c


def main():
    raiz = os.path.dirname(os.path.abspath(__file__))
    img = os.path.join(raiz, 'img')
    if not os.path.isdir(img):
        os.makedirs(img)

    og = os.path.join(img, 'og.png')
    n = ciudad(1200, 630, base=560, x0=470, ancho=82, hueco=9,
               altmax=430, grosor=2).guardar(og)
    print('escrito', os.path.relpath(og, raiz), n, 'bytes')

    ico = os.path.join(raiz, 'icono.png')
    n = marca(512).guardar(ico)
    print('escrito', os.path.relpath(ico, raiz), n, 'bytes')


if __name__ == '__main__':
    main()
