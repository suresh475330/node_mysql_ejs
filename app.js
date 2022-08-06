const express = require("express")
const app = express()
require("dotenv").config()
const db = require("./db/connect")

app.set("view engine","ejs")
app.use(express.urlencoded({extended : true}))


app.get("/", async (req,res)=>{
    const [rows] = await db.query(`SELECT * FROM notes`)
    const msg = "index rend succes" 
    res.status(200).render("pages/index",{rows,msg})
})

async function getNote(_id){
    const [rows] =  await db.query(`SELECT * FROM notes
    WHERE _id = ?`,[_id]);
    return rows[0]
}

app.get("/addnotes",(req,res) => {
    res.status(200).render("pages/addNotes")
})

app.get("/editNote/:id",async (req,res) => {
    const _id = req.params.id
    const note = await getNote(_id)
    res.status(200).render("pages/editNote",{note})
})

app.get("/deleteNote/:id",async (req,res) => {
    const _id = req.params.id
    await db.query(`DELETE FROM notes
    WHERE _id = ?`,[_id])
    res.status(302).redirect("/")
})


app.post("/addnotes", async (req,res) => {
     const { title,content} =  req.body

    const [results] = await db.query(`INSERT INTO notes (title,content)
    VALUES (?,?)`,[title,content]);

    const _id =  results.insertId
    const note = await getNote(_id)
    // console.log(note);

    res.status(302).redirect("/")
})


app.post("/editNote/:id", async (req,res) => {

    const {title , content} = req.body
    const _id =  Number(req.params.id)

    await db.query(`UPDATE notes SET 
    title=?,content=? 
    WHERE _id = ?`,[title,content,_id])

    const note = await getNote(_id)
    // console.log(note);

    res.status(302).redirect("/")
})



const port = process.env.PORT || 5000

const Start = () => {
    app.listen(port,()=>{
        console.log(`app is running on http://localhost:${port}`)
    })
}

Start()