function insertHotel(req) {
  var query1 = "INSERT INTO  hotels (name, location, owner_id, stars, description) VALUES (?,?,?,?,?)";
  var query2 = "INSERT INTO  facilities (hotel_id, pool, restaurant, bar, gym, kids_area, spa) VALUES (?,?,?,?,?,?,?)";
  var query3 = "SELECT id FROM hotels WHERE owner_id=? AND name=?";
  facilities = {
    pool: req.body.pool ? 1 : 0,
    restaurant: req.body.restaurant ? 1 : 0,
    bar: req.body.bar ? 1 : 0,
    gym: req.body.gym ? 1 : 0,
    kidsArea: req.body.kidsArea ? 1 : 0,
    spa: req.body.spa ? 1 : 0
  };

  return new Promise((resolve, reject) => {
    console.log(req.user);
    req.con.query(query1, [req.body.hotelname, req.body.location, req.user.id, req.body.stars, req.body.description],
      (err) => {
        if (err) throw err;
        req.con.query(query3, [req.user.id, req.body.hotelname],
          (err, rows) => {
            if (err) throw err;
            var hotelId = rows[0].id;
            req.con.query(query2, [hotelId, facilities.pool, facilities.restaurant, facilities.bar,
              facilities.gym, facilities.kidsArea, facilities.spa], (err) => {
                if (err) throw err;
                resolve();
              }
            );
          }
        );
      }
    );
  });
}

function getAllOwnedHotels(req) {
  var sql = "SELECT * FROM hotels WHERE owner_id=?";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [req.user.id], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels);
    });
  });
}

function getAllApprovedHotels(req) {
  var sql = "SELECT * FROM hotels where approved = ?";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [1], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels);
    });
  });
}

function getAllApprovedHotelsWithFacilities(req) {
  var sql = "SELECT * FROM hotels, facilities where approved = ? AND hotels.id = facilities.hotel_id";
  sql = addFacilitiesToQuery(req, sql);
  return new Promise((resolve, reject) => {
    req.con.query(sql, [1], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels);
    });
  });
}

function getHotelDetails(req) {
  var sql = "SELECT * FROM hotels, facilities where approved = ? AND hotels.id = ? AND hotels.id = facilities.hotel_id";
  return new Promise((resolve, reject) => {
    req.con.query(sql, [1, req.params.hotel_id], function (err, hotels) {
      if (err) console.log(err);
      resolve(hotels[0]);
    });
  });
}

function getOwnedHotelDetails(req) {
  var query1 = "SELECT * FROM hotels, facilities where hotels.id = ? AND hotels.id = facilities.hotel_id";
  var query2 = "SELECT * FROM room_type where hotel_id = ?";
  return new Promise((resolve, reject) => {
    req.con.query(query1, [req.params.hotel_id], function (err, hotels) {
      if (err) console.log(err);
      req.con.query(query2, [req.params.hotel_id], (err, rooms) => {
        if (err) console.log(err);
        resolve({ hotel: hotels[0], rooms: rooms });
      });
    });
  });
}
function insertRooms(req) {
  var query = "INSERT INTO  room_type (room_type, hotel_id, room_view, price, number_of_rooms) VALUES (?,?,?,?,?)";
  return new Promise((resolve, reject) => {
    console.log(req.user);
    req.con.query(query, [req.body.roomType, req.params.hotel_id, req.body.view, req.body.price, req.body.quantity],
      (err) => {
        if (err) throw err;
      });
    resolve();
  });
}

module.exports = {
  insertHotel: insertHotel,
  getAllApprovedHotels: getAllApprovedHotels,
  getAllApprovedHotelsWithFacilities: getAllApprovedHotelsWithFacilities,
  getHotelDetails: getHotelDetails,
  getAllOwnedHotels: getAllOwnedHotels,
  getOwnedHotelDetails: getOwnedHotelDetails,
  insertRooms: insertRooms
};


function addFacilitiesToQuery(req, sql) {
  if (req.query.pool) {
    sql = sql + " AND facilities.pool = 1";
  }
  if (req.query.restaurant) {
    sql = sql + " AND facilities.restaurant= 1";
  }
  if (req.query.bar) {
    sql = sql + " AND facilities.bar = 1";
  }
  if (req.query.wifi) {
    sql = sql + " AND facilities.wifi = 1";
  }
  if (req.query.gym) {
    sql = sql + " AND facilities.gym = 1";
  }
  if (req.query.kids_area) {
    sql = sql + " AND facilities.kids_area = 1";
  }
  if (req.query.spa) {
    sql = sql + " AND facilities.spa = 1";
  }
  sql = sql + ";";
  return sql;
}

