.PHONY: dev sync test

sync:
	uv sync --extra api --extra dev

dev: sync
	uv run wavez-api

test: sync
	uv run pytest
