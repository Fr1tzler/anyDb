docker run -it --rm \
    -p 5432:5432 \
    --name postgres \
    -e POSTGRES_PASSWORD=12345 \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v $PWD/../../pgdata/anyDb/pgdata:/var/lib/postgresql/data \
    postgres:15.4-alpine3.18
