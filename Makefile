run_local:
	docker compose up --watch

stop_local:
	docker compose down -v --remove-orphans