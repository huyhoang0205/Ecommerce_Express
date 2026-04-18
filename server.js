const app = require('./src/app');
const {app:{port}} = require('./src/configs')
const {connectRedis} = require('./src/dbs/init.redis')
const {seedingResources} = require('./src/dbs/resourece.seeding.mongodb')
const {seedingRoles} = require('./src/dbs/role.seeding.mongodb')
const PORT =  port;

const startServer = async () => {
    await connectRedis();
    require('./src/dbs/init.mongodb');
    await seedingResources();
    await seedingRoles();
    const server = app.listen(PORT , () => {
        console.log(`Express eCommerce start with ${PORT}`)
    })

    process.on('SIGINT', () => {
        server.close(() => {
            console.log(`Exit Server Express`)
        });
    })
}

startServer();

