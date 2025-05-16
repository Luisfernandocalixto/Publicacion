const { DATABASE_URL,EMAIL, NAME, BREVO_API_KEY, URL, JWT_SECRET} = process.env;

module.exports = {
    DATABASE_URL : `${DATABASE_URL}`,
    EMAIL : `${EMAIL}`, NAME : `${NAME}`,  BREVO_API_KEY : `${BREVO_API_KEY}`, URL : `${URL}`, JWT_SECRET: `${JWT_SECRET}`
};
