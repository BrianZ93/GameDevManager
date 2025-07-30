run_local:
	docker compose up --watch

run_local_quiet:
	docker compose -f docker-compose.no-watch.yml up --watch

stop_local:
	docker compose down --remove-orphans

stop_local_quiet:
	docker compose -f docker-compose.no-watch.yml down --remove-orphans

clean_local:
	docker compose down -v --remove-orphans
	docker volume rm gamedevmanager_postgres_data || true

clean_local_quiet:
	docker compose -f docker-compose.no-watch.yml down -v --remove-orphans
	docker volume rm gamedevmanager_postgres_data || true