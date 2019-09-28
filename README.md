# Haskell VSCode formatter extension

This extension composes both hindent and stylish-haskell to make the code look great.

## Needed tools

```bash
stack install stylish-haskell hindent
```

## TODO

1. Add .hindent config autosearch
2. Add .stylish-haskell config autosearch
3. Binary paths configs in VSCode

## CHANGES

v0.0.3

Note the working directory of the hindent and stylish-haskell will be
the top level workspace directory and any `.hindent.yaml` or `stylish-haskell.yaml`
will be picked up from there.
