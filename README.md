# Nest.js sample code

```bash
  # run database container
  docker run --name nest -d -p 3306:3306 -e MYSQL_DATABASE=nest -e MYSQL_ROOT_PASSWORD=test -v ~/database/nest:/var/lib/mysql mysql:5.7

  npm install   # install packges
  npm test      # run test
  npm run build # transpile typescript
  npm start     # run sample code
```
