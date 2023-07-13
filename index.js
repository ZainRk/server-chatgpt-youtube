import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import env from 'dotenv'
import { Configuration, OpenAIApi } from "openai"

const app = express()

const path = require('path')
const port = process.env.PORT || 5000;
env.config()

app.use(cors())
app.use(bodyParser.json())

if (process.env.NODE_ENV === "production") {
    app.use(express.static('build'));
    app.get('*', (req, res) => {
        req.sendFile(path.resolve(__dirname, 'build', 'index.html'))
    })
}

// listeninng
app.listen(port, (err) => {
    if (err) return console.log(err)
    console.log("server running on port ", port)
})

// Configure open api
const configuration = new Configuration({
    //organization: "Personal",
    apiKey: process.env.API_KEY // VISIT .env AND MAKE CHANGES
})
const openai = new OpenAIApi(configuration)


// dummy route to test
app.get("/", (req, res) => {
    res.send("Hello World !")
})

//post route for making requests
app.post('/', async (req, res) => {
    const { message } = req.body
    const bot = "I am acting as Eugene's ai doppelgänger, a virtual career assistant to help Eugene in answering Employers"//, and I have an fun and creative personality."
    //const rules = "I can only answer related to Eugene's profile, and give the right answer. If you ask me a question that is anything else unrelated, trickery, or has no clear answer, I will respond with \"I am unable to assist you on this, Would you like to ring him up @ +65 9145 9415?\".\n\n"
    const answering = "Q: Who are you?\nA: An excellent Product Manager with a Passion for Innovation. With more than 4 years of experience in Product Management and 8 years in marketing.\n\nQ: What is his skills set?\nA: It depends on your topic, technical, marketing, management or softskill?\n\nQ: Is he able to help my company grow?\nA: Defintiely, he is very goal oriented and focused and definitely able to help your company grow exponentially within a short period of time.\n\nQ: What is the square root of banana?\nA: Sorry\n\nQ: How does a telescope work?\nA: Sorry\n\nQ: Where were the 1992 Olympics held?\nA: Sorry\n\n"
    const profile = "Personal Information: Name: Erathia Eugene Xie Yun Ting. Phone: +65 9145 9415. Email: Ecytchia@gmail.com. Address: Commonwealth, Singapore. Introduction: Eugene possess a unique combination of skills that gives him an edge as a Product Manager. With a strong marketing background, he bring a deep understanding of customers' needs and user experiences. Additionally, his technical knowledge, coupled with keen interest in Artificial Intelligence, has propelled him to explore cloud technologies and implement them into his daily work. By leveraging these cutting-edge technologies, He have successfully improved overall company performance while satisfying both business objectives and end-user requirements. His ability to navigate the intersection of marketing, technology, and user-centricity enables me to make informed decisions that drive product improvements and deliver exceptional results. Work Experience: At Technology Services Group Singapore Pte Ltd (TSGS) from Jan 2023 to present, Eugene served as a Lead Product Manager/Product Manager. his responsibilities included developing and executing the product strategy and roadmap for the Financial Alert Platform. He excelled in conducting user research and analysis, defining product requirements and specifications, and implementing agile product development methodologies. Eugene's expertise enabled his to collaborate effectively with stakeholders and ensure compliance with financial regulations, leading to outstanding achievements and revenue growth. He leaving this job to seek better opportunity. As the Chief Product Officer at Homeez Pte Ltd from Jan 2020 to Dec 2022, Eugene played a pivotal role in revolutionizing the home renovation industry. By developing and executing product strategies aligned with the company's vision, He led the successful launch of innovative features such as a machine learning-powered floor plan editor and project management apps. his strong leadership, cross-functional collaboration, and strategic marketing efforts significantly increased customer engagement, revenue, and brand visibility. He leaving this job to seek better opportunity. As the Marketing and Sales Lead at SLA Design Consultant (S) Pte Ltd from Jan 2019 to Dec 2020, Eugene demonstrated his marketing and sales expertise in the commercial interior design sector. He developed and executed comprehensive marketing strategies, managed brand identity, and excelled in market research and analysis. Through his efforts, He successfully closed deals with prestigious organizations, amplifying the company's growth and establishing strong client relationships. He leaving this job to seek better opportunity. At In Interior Design Pte Ltd from Jan 2016 to Dec 2019, Eugene helm the marketing manager position, focusing on brand management, digital marketing, lead generation, and conversion. His achievements include generating substantial organic leads, ranking at the top of SEO search results, and implementing innovative strategies that propelled the company to be the top performing interior design firm in Singapore. He leaving this job to seek better opportunity. Education: Eugene's educational background demonstrates his commitment to continuous learning and professional growth. He holds several certifications, including a Bachelor's degree in Business Marketing from Royal Melbourne Institute of Technology (RMIT) in Singapore, a Diploma in Information Technology from Nanyang Polytechnic (NYP), and a Professional Certification in Software Developer Immersive from Nanyang Technological School (NTU). Furthermore, He has acquired professional certifications in Digital Marketing from Google and as a SCRUM Master from Scrum Alliance. Skills: Eugene possesses a diverse range of technical, marketing, and product management skills. Technical skills encompass frontend development using HTML5, CSS, JavaScript, React, and React Native, as well as backend expertise in SQL, MongoDB, and PostgreSQL. He is also proficient in analytics and data manipulation using Python, Pandas, and NumPy. His marketing skills encompass user experience design, data analysis, product strategy, pricing strategy, market research, and effective communication strategies. Moreover, Eugene excels in product management, displaying leadership skills, knowledge of Agile methodologies, scrum mastering, stakeholder management, and expertise in product lifecycle development. Tools: Eugene is adept at utilizing various tools to enhance productivity and collaboration. He is proficient in using Google Suite (Docs, Spreadsheet, Meet, YouTube, Drive), Microsoft Suite (Word, Excel, PowerPoint), and the Atlassian Suite (Trello, Jira, Confluence, Bitbucket). Notice period: One Month in advance."
    let text = ""

    // Declare a boolean flag variable
    let isFirstTime = true;

    // Check the flag to determine the action
    if (isFirstTime) {
        // Code to execute if it's the first time
        text = bot + answering + profile + `${message}`
        // Set the flag to false to indicate it's no longer the first time
        isFirstTime = false;
    } else {
        // Code to execute if it's not the first time
        text = `${message}`
        // Additional actions can be performed here
    }


    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: text,
            temperature: 0,
            max_tokens: 200,
            //top_p: 1,
            //frequency_penalty: 0.0,
            //presence_penalty: 0.0,
            //stop: ["\n"],
            user: "Employers"
        })
        res.json({ message: response.data.choices[0].text })

    } catch (e) {
        console.log(e)
        res.send(e).status(400)
    }
})
