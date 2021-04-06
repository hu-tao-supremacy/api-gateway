#!/usr/bin/python3
import os
import pathlib

base = pathlib.Path(__file__).parent.absolute()

os.chdir(base)

def sym(src, dst):
    os.chdir(base)
    os.symlink(dst, src)

sym("./src/apis", "../apis/gen/nest")
sym("./src/graphql", "../apis/gen/gql")
