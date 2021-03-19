#!/usr/bin/python3
import os
import pathlib

base = pathlib.Path(__file__).parent.absolute()

os.chdir(base)

def sym():
    os.chdir(base)
    src = "./src/apis"
    dst = "../apis/gen/nest"
    os.symlink(dst, src)

sym()
