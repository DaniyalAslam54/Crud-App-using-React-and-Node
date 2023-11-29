import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dddd",
  database: "crud_db",
});

app.get("/", (req, res) => {
  const sql = "SELECT * FROM student";
  db.query(sql, (error, result) => {
    if (error) return res.json({ Message: "Error while fetching" });
    return res.json(result);
  });
});

app.post("/post", (req, res) => {
  const { Id, Name, RollNo } = req.body;

  // Check if Id is present for update
  if (Id !== undefined && Id !== null) {
    // Check if the record with the specified Id exists
    const selectSql = "SELECT * FROM student WHERE Id = ?";
    db.query(selectSql, [Id], (selectError, selectResult) => {
      if (selectError) {
        return res.json({ Message: "Error while checking for existing record" });
      }

      // If the record with the specified Id exists, perform an update
      if (selectResult.length > 0) {
        const updateSql = "UPDATE student SET Name = ?, RollNo = ? WHERE Id = ?";
        const updateValues = [Name, RollNo, Id];

        db.query(updateSql, updateValues, (updateError, updateResult) => {
          if (updateError) {
            return res.json({ Message: "Error while updating" });
          }

          return res.json(updateResult);
        });
      } else {
        // If the record with the specified Id doesn't exist, perform an insert
        const insertSql = "INSERT INTO student (Id, Name, RollNo) VALUES (?, ?, ?)";
        const insertValues = [Id, Name, RollNo];

        db.query(insertSql, insertValues, (insertError, insertResult) => {
          if (insertError) {
            return res.json({ Message: "Error while inserting" });
          }

          return res.json(insertResult);
        });
      }
    });
  } else {
    // If Id is not provided, handle accordingly (e.g., return an error response)
    return res.json({ Message: "Id is required for update" });
  }
});


app.delete('/delete/:id', (req, res) => {
  const idToDelete = req.params.id;

   
  const deleteSql = 'DELETE FROM student WHERE Id = ?';

  db.query(deleteSql, [idToDelete], (error, result) => {
    if (error) {
      return res.json({ message: 'Error while deleting record' });
    }

    return res.json({ message: 'Record deleted successfully' });
  });
});

app.listen(8081, () => {
  console.log("listening on port 8081");
});
