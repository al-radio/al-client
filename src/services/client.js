class ClientService {
  constructor() {
    this.clients = [];
  }

  addClient(res) {
    this.clients.push(res);
    res.on("close", () => {
      this.clients = this.clients.filter((client) => client !== res);
    });
  }
}



export default new ClientService();
