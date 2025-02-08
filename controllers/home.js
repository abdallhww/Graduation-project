const Technicalsupport = (req, res,next) => {
    res.render("Technicalsupport", { title: "=>Technical" });
    res.end();
  };


  
const Brokers = (req, res,next) => {
    res.render("Brokers", { title: "=>Brokers" });
    res.end();
  };
  module.exports = {Brokers,Technicalsupport};
  


const Viewproducts = (req, res,next) => {
    res.render("Viewproducts", { title: "=>Viewp" });
    res.end();
  };
  module.exports = {Brokers,Technicalsupport,Viewproducts}; 