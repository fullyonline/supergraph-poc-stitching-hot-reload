## rover

```
yarn add -D @apollo/rover
```

## Compose supergraph schema

```
yarn rover supergraph compose --config ./supergraph-config.yaml
```

oder mit skript:

```
yarn compose
```

## Apollo Router

### install

für Win/Unix/Mac:

```
curl -sSL https://router.apollo.dev/download/nix/latest | sh
``` 

### config

router.yaml sollte wie folgt aussehen:

```
#
# supergraph: Configuration of the Supergraph server
#
supergraph:
  # The socket address and port to listen on
  listen: 127.0.0.1:4500

```

### Start

```
./router --config router.yaml --dev --supergraph supergraph-schema.graphql
```

