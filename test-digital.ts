import { digitalService } from './src/services/digitalService';

async function test() {
  console.log("Fetching today node...");
  const node = await digitalService.fetchTodayNode();
  console.log("Node:", node);
  
  if (node) {
    console.log("Updating screen_time to 120...");
    await digitalService.updateNode(node.id, { screen_time: 120 });
    console.log("Done.");
  }
}

test();
