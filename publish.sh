ROOT=`pwd`

echo $ROOT
cd $ROOT/client && npm run _build
cd $ROOT/admin && npm publish