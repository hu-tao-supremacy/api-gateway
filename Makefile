apis:
	@cd $(dirname $0)
	git clone https://github.com/hu-tao-supremacy/api.git apis
	python3 sym.py

env:
	@cd $(dirname $0)
	mkdir -p src/types
	npx gen-env-types .env.local -o src/types/env.d.ts -e .
