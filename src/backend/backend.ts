import express from 'express';
import { Server, ic, query } from 'azle';
import { HttpResponse, HttpTransformArgs } from 'azle/canisters/management';
import { v4 as uuidv4 } from 'uuid';

// import multer from 'multer';

// // Setup multer storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });
// const upload = multer({ storage: storage });

const app = express();

app.use(express.json());

// Initialize storage for user data
let phonebook = {
    'identity-id': { 'namae': '123-456-789', 'added': new Date() }
};

let userDataList: { [key: string]: any } = {};
let appProvider: { [key: string]: any }[] = [];

// Routes
// User route to user panel

app.post('/whoami', (req, res) => {
    console.log('hello');
    res.send(ic.caller().toString());
});

app.post('/login', (req, res) => {
    const userKey = ic.caller().toString();

    if (!userDataList[userKey]) {
        return res.status(400).json({ message: 'Account Not Found' });
    }

    res.status(200).json({ message: 'Account Found', ii_id: userKey });
});

app.post('/register-phase-1', (req, res) => {
    const userKey = ic.caller().toString();

    const {
        governmentId,
        photo1,
        photo2,
        photo3,
    } = req.body;

    // if (userDataList[userKey]) {
    //     return res.status(400).json({ message: 'Account Already Created' });
    // }

    userDataList[userKey] = {
        fullName: '',
        dateOfBirth: '',
        nationality: '',
        gender: '',
        address: '',
        governmentId: governmentId,
        phoneNumber: '',
        email: '',
        photo1: photo1 || '',
        photo2: photo2 || '',
        photo3: photo3 || '',
        sourceOfFunds: '',
        bankAccountInfo: '',
        taxIdentificationNumber: '',
        integratedApp: []
    };

    res.status(200).json({ message: 'Account Created, Registration Phase 1 Completed', ii_id: userKey });
});

app.post('/register-phase-2', (req, res) => {
    console.log('Received KYC data:', req.body);

    const {
        fullName,
        dateOfBirth,
        nationality,
        gender,
        address,
        phoneNumber,
        email,
        sourceOfFunds,
        bankAccountInfo,
        taxIdentificationNumber
    } = req.body;

    const userKey = ic.caller().toString();

    // if (!userDataList[userKey]) {
    //     return res.status(400).json({ message: 'Account Not Found' });
    // }

    const userData = {
        fullName,
        dateOfBirth,
        nationality,
        gender,
        address,
        phoneNumber,
        email,
        sourceOfFunds,
        bankAccountInfo,
        taxIdentificationNumber
    };

    userDataList[userKey] = { ...userDataList[userKey], ...userData };

    res.status(200).json({ message: 'KYC data received successfully, Registration Phase 2 Completed', data: userData });
});

app.get('/my-profile', (req, res) => {
    const userKey = ic.caller().toString();
    console.log(userKey)

    if (!userDataList[userKey]) {
        return res.status(400).json({ message: 'Account Not Found' });
    }

    let userdata = userDataList[userKey]
    res.status(200).json({ message: 'Success', data: userdata });
});


// Application Provider route to integrate
app.get('/get-app-list', (req, res) => {
    const userKey = ic.caller().toString();
    const appList = appProvider.filter((app) => app.ownerId === userKey);

    res.status(200).json({ message: 'Success', data: appList });
});

app.post('/create-app', (req, res) => {
    const userKey = ic.caller().toString();

    const { appName, postNotificationEndpoint } = req.body;

    const newApp = {
        uniqueId: 1,
        ownerId: userKey,
        appName: appName,
        postNotificationEndpoint: postNotificationEndpoint
    };

    appProvider.push(newApp);

    res.status(200).json({ message: 'Successfully Created New App', data: newApp });
});

// Web 2 integration (should be iframe integration)
app.get('/iframe-web2-integration', (req, res) => {
    // const appId = req.query.appId as string;
    const appId = 1;
    const app = appProvider.find((app) => app.uniqueId === appId);

    if (!app) {
        return res.status(400).json({ message: 'No App Found' });
    }

    res.status(200).json({ message: 'Success', data: app });
});

app.post('/face-verification', async (req, res) => {
    // const appId = req.query.appId as string;
    const appId = 1;
    const app = appProvider.find((app) => app.uniqueId === appId);
    const userKey = ic.caller().toString();

    if (!app) {
        return res.status(400).json({ message: 'No App Found' });
    }

    let userData = userDataList[userKey];
    const { facePhoto } = req.body;

    if (!facePhoto) {
        return res.status(400).json({ message: 'Face Photo Not Detected' });
    }

    // Set outgoing HTTP options if necessary
    ic.setOutgoingHttpOptions({
        maxResponseBytes: 20_000n,
        cycles: 500_000_000_000n,
        transformMethodName: 'transform'
    });

    try {
        const fetchResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer <secret key>`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Use this sample image to compare with real data is it similar or not'
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: userData.photo2
                                }
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: userData.photo3
                                }
                            },
                            {
                                type: 'text',
                                text: 'Respond is similar or not with real image below, respond only with yes/no'
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: facePhoto
                                }
                            }
                        ]
                    }
                ]
            })
        });

        const data = await fetchResponse.json();

        // Ensure data.choices and data.choices[0].message.content are valid
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            return res.status(500).json({ error: 'Unexpected response structure from AI service' });
        }

        const messageContent = data.choices[0].message.content.trim(); // Trim whitespace for accurate comparison

        // Check if the message content is "Yes" and set the success flag accordingly
        const success = messageContent.toLowerCase() === "yes";

        // Send response based on the extracted message content
        res.status(200).json({
            message: success ? 'Success' : 'Failure',
            data: success ? data : null
        });

        // If verification is successful, send a POST request to app.postNotificationEndpoint
        if (success) {
            try {
                await fetch(app.postNotificationEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'login ok',
                        message: 'Face verification successful'
                    })
                });

                console.log('success sending successful login information to app endpoint')
            } catch (notificationError) {
                console.log('success sending successful login information to app endpoint')
                console.error('Notification Error:', notificationError);
            }
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch data from AI service' });
    }
});


app.post('/allow-integration', (req, res) => {
    const userKey = ic.caller().toString();
    const { appId } = req.body;

    if (!userDataList[userKey]) {
        userDataList[userKey] = { integratedApp: [] };
    }
    
    userDataList[userKey].integratedApp = [
        ...userDataList[userKey].integratedApp,
        appId
    ];

    res.status(200).json({ message: 'Successfully Integrate New App' });
});




app.get('/get-kyc-list', (req, res) => {
    res.json(userDataList);
});

app.get('/greet', (req, res) => {
    const name = req.query.name as string;
    res.json({ greeting: `Hello, ${name}` });
});

app.post('/price-oracle', async (req, res) => {
    ic.setOutgoingHttpOptions({
        maxResponseBytes: 20_000n,
        cycles: 500_000_000_000n,
        transformMethodName: 'transform'
    });

    const date = '2024-04-01';
    try {
        const response = await (await fetch(`https://api.coinbase.com/v2/prices/${req.body.pair}/spot?date=${date}`)).json();
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from price oracle' });
    }
});

// Serve static files
app.use(express.static('dist'));

// Export the server
export default Server(
    () => app.listen(),
    {
        transform: query([HttpTransformArgs], HttpResponse, (args) => {
            return {
                ...args.response,
                headers: [] // Adjust headers if needed
            };
        })
    }
);
