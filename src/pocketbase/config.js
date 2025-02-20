import Pocketbase from "pocketbase";
//import ticket from "classes"

const pb = new Pocketbase("http://192.168.1.56:8090");

export const CreateNewTicket = async (newTicket) => {
  await pb.collection("ticket").create(newTicket);
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEmail() {
  const domains = ["example.com", "test.com", "sample.com"];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `user${getRandomInt(1, 10000)}@${randomDomain}`;
}

function generateDataArray(length, CarSaleCategoryIds) {
  return Array.from({ length }, () => ({
    CarSaleCategoryID: CarSaleCategoryIds[getRandomInt(0, CarSaleCategoryIds.length - 1)],
    Name: "test",
    Email: getRandomEmail(),
    Cost: getRandomInt(1, 1000),
  }));
}

export async function createMultipleRecords() {
  try {
    const CarSaleCategories = await fetchCarSaleCategories();
    const CarSaleCategoryIds = CarSaleCategories.map(category => category.id);

    const dataArray = generateDataArray(1000, CarSaleCategoryIds);
    const createdRecords = [];
    for (const data of dataArray) {
      try {
        const record = await pb.collection("CarSale").create(data);
        createdRecords.push(record);
      } catch (error) {
        console.error("Error creating record:", error);
        throw error;
      }
    }
    return createdRecords;
  } catch (error) {
    console.error("Error fetching CarSale categories:", error);
    throw error;
  }
}

// New function to fetch CarSales
export async function fetchCarSales() {
  try {
    const records = await pb.collection("CarSale").getFullList();
    return records;
  } catch (error) {
    console.error("Error fetching CarSales:", error);
    throw error;
  }
}

// New function to fetch CarSalecategories 
export async function fetchCarSaleCategories() {
  try {
    const records = await pb.collection("CarSaleCategory").getFullList();
    return records;
  } catch (error) {
    console.error("Error fetching CarSalecategories:", error);
    throw error;
  }
}
