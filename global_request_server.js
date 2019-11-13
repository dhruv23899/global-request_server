var express = require("express");
var gr = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

gr.use(bodyParser.urlencoded({ extended: true }));
gr.use(cors());
gr.use(bodyParser.json());
gr.use(express.static("public"));
gr.set("view engine","ejs");
//var Micro_Schema = require("./Micro_Schema.js")
//var Micro_Schema= require ("./../Micro_Schema.js")
//var Global_Request=Micro_Schema.Global_Request_Schema
var {Global_Request} = require ("./global_request_schema.js")

mongoose.connect(
  "mongodb+srv://micro:qwerty123@cluster0-bmsv0.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

gr.get("/global_requests",(req,res)=>{
    Global_Request.find({},(err,all_global_requests)=>{
        if(err){
            console.log("Error:"+err);
            console.log({status:false,error:err})
        }
        else{
            console.log("Obj sent sucess");
            // res.render("Global_Request_home.ejs",{global_requests:all_global_requests});
            res.send({status:true,requests:all_global_requests})
        }
    });
  })


gr.get("/add_global_request",(req,res)=>{
    res.render("add_global_request.ejs",{});
  })
gr.post("/add_global_request", (req,res) => {
    let Id=req.body.Id
    let title = req.body.title;
    let desc = req.body.desc;
    let user = req.body.user;
    let ms_mf = req.body.ms_mf
    let status = req.body.status
    let link_msmf = null
    Global_Request.create({title: title,desc: desc,user: user, ms_mf:ms_mf,status:status,link_msmf:link_msmf},function(err,globalreq){
      if(err){
        console.log(err);
        res.send({status:false,error:err})
      }else {
        console.log(globalreq);
        console.log("Global Request saved successfully")
        res.send({status:true,req:globalreq})
      }
    })
});

gr.post("/handle_request",(req,res)=>{
  let status = req.body.status || "handled";
  let link_msmf = req.body.link_msmf;
  Global_Request.findByIdAndUpdate(req.body.req_id,{status:status,link_msmf:link_msmf},function(err,upreq){
    if(err){
      console.log("Error "+err)
      res.send({status:false,error:err})
    }else {
      console.log("Handled Request")
      res.send({status:true,req:upreq})
    }
  })
})

gr.use("/retrieve_all", (req,res) => {
    Global_Request.find({},(err,all_global_requests)=>{
        if(err){
            console.log("Erroe:"+err);
        }
        else{
            res.json(all_global_requests);
            console.log("Obj sent sucess");
        }
    });
});

gr.use("/delete_one_global_request/:id", (req,res) => {
    Global_Request.findByIdAndRemove(req.params.id,(err)=>{
      if(err){
          console.log("Erroe:"+err);
      }
      else{
          console.log("global requests delete success");
          res.redirect("/global_requests")
      }
  })
});

gr.get("/get_update_info_global_request/:id", (req, res) => {
    Global_Request.findById(req.params.id, (err, one_global_request) => {
      if (err) {
        console.log("Erroe:" + err);
      } else {
        console.log("Here in get" + req.params.id);
        console.log("Herein get" + one_global_request.title);
        res.render("update_global_request.ejs", { one_global_request: one_global_request });
        console.log("global_request sent for update sucess");
      }
    });
  });
  gr.use("/update_global_request/:id", (req, res) => {
    console.log("Here" + req.params.id);
    console.log("Here" + req.body.title);
    console.log("Here" + req.body.documentation);
    console.log("Here body" + toString(req.body));
    let global_request_id=req.params.id;
    let Id=req.body.Id;
    let title = req.body.title;
    let text = req.body.text;
    let user = req.body.user;
    Global_Request.findByIdAndUpdate(
        global_request_id,
      {
        $set: {
            Id:Id,
            title:title,
            text:text,
            user:user
        }
      },
      err => {
        if (err) console.log("Err" + err);
        else {
          console.log("global_request updated succesfully");
        }
      }
    );
    res.redirect("/global_requests");
  });

//module.exports = gr
gr.listen(process.env.PORT||5003, () => {
  console.log("listening at port: 5003");
});
