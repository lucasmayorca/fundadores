#!/usr/bin/env python3
"""Genera icono.png (152x152) sin dependencias externas.

Ícono de "Añadir a pantalla de inicio" para el juego. Tres columnas que suben,
una por pilar: startup (ámbar), producto (azul), tecnología (verde). Mismo
método que make_icon.py — PNG a mano con zlib, cero dependencias.
"""
import struct, zlib, os

W = H = 152
BG      = (0x0a, 0x0c, 0x10)
STARTUP = (0xe8, 0xa3, 0x3d)
PRODUCTO= (0x5a, 0xa9, 0xf0)
TECH    = (0x35, 0xc4, 0x6a)

# (x_inicio, ancho, y_inicio, alto, color) — columnas de altura creciente
BARS = [
    (30, 26, 92, 34, STARTUP),
    (63, 26, 68, 58, PRODUCTO),
    (96, 26, 40, 86, TECH),
]


def main():
    rows = []
    for y in range(H):
        row = bytearray()
        for x in range(W):
            px = BG
            for bx, bw, by, bh, color in BARS:
                if bx <= x < bx + bw and by <= y < by + bh:
                    px = color
                    break
            row += bytes(px)
        rows.append(b'\x00' + bytes(row))

    raw = zlib.compress(b''.join(rows), 9)

    def chunk(tipo, data):
        c = tipo + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    png = (b'\x89PNG\r\n\x1a\n'
           + chunk(b'IHDR', struct.pack('>IIBBBBB', W, H, 8, 2, 0, 0, 0))
           + chunk(b'IDAT', raw)
           + chunk(b'IEND', b''))

    destino = os.path.join(os.path.dirname(__file__), 'icono.png')
    with open(destino, 'wb') as f:
        f.write(png)
    print('escrito', os.path.normpath(destino), len(png), 'bytes')


if __name__ == '__main__':
    main()
