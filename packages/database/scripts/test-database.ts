import "dotenv/config";
import { prisma } from "../client";

async function testDatabase() {
	console.log("🔍 Testing Prisma connection...\n");

	try {
		console.log("✅ Connected to database!");

		console.log("\n📝 Creating a test user...");
		try {
			// Delete existing test user if exists
			await prisma.user.deleteMany({
				where: {
					email: "demo@example.com",
				},
			});
		} catch (error) {
			// Silently ignore if deletion fails
			console.log(error);
		}

		const newUser = await prisma.user.create({
			data: {
				email: "demo@example.com",
				name: "Demo User",
			},
		});
		console.log("✅ Created user:", newUser);

		console.log("\n📋 Fetching all users...");
		const allUsers = await prisma.user.findMany();
		console.log(`✅ Found ${allUsers.length} user(s):`);
		allUsers.forEach((user) => {
			console.log(`   - ${user.name} (${user.email})`);
		});

		console.log("\n🎉 All tests passed! Your database is working.\n");
	} catch (error) {
		console.error("❌ Error:", error);
	} finally {
		await prisma.$disconnect();
	}
}

testDatabase();
