import sequelize from "../lib/sequelize";
import "@/models"; // Register models

async function sync() {
    try {
        console.log("Syncing database...");
        // Sync specific models to avoid User table issues
        await sequelize.models.Block.sync({ alter: true });
        await sequelize.models.Conversation.sync({ alter: true });
        await sequelize.models.Message.sync({ alter: true });
        // await sequelize.sync({ alter: true });
        console.log("Database synced successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error syncing database:", error);
        process.exit(1);
    }
}

sync();
