const models = require('./models');
const { sequelize } = require('./config/db');

async function checkDB() {
  try {
    await sequelize.authenticate();
    console.log('=== Database Connection Successful ===\n');

    const modelNames = Object.keys(models);
    let totalEntries = 0;
    
    for (const name of modelNames) {
      const Model = models[name];
      try {
        const count = await Model.count();
        totalEntries += count;
        console.log(`[Table/Model: ${name}] - ${count} entries`);
        
        if (count > 0) {
          const items = await Model.findAll({ limit: 5, raw: true });
          console.log(`Sample Data for ${name}:`);
          console.log(JSON.stringify(items, null, 2));
          console.log('-----------------------------------');
        }
      } catch (err) {
        console.log(`[Table/Model: ${name}] - Error querying table: ${err.message}`);
      }
    }
    
    console.log(`\nTOTAL ENTRIES ACROSS ALL TABLES: ${totalEntries}`);
  } catch (err) {
    console.error('=== Database Connection Failed ===');
    console.error(err.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

checkDB();
