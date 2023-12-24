if [ ! -d ./target ]
then
  mkdir ./target
  touch ./target/plugin.json
elif [ -d ./target ] && [ ! -f ./target/plugin.json ]
then
  touch ./target/plugin.json
fi

rimraf ./target/plugin.json
node ./scripts/generate.js
