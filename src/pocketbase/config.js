import Pocketbase from "pocketbase";
//import ticket from "classes"

const pb = new Pocketbase("http://192.168.1.59:8090");

export const CreateNewTicket = async (newTicket) => {
  await pb.collection("ticket").create(newTicket);
};
