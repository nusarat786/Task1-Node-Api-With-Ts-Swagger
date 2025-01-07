import { Express, Request, Response } from "express";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger configuration options
const options: any = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DEMO API",
            description: "Learning Swagger",
            version: "1.0.0",  
        },
        servers: [
            {
                url: "http://localhost:4000",  
                description: "Local Development Server",
            },
        ],
        components: {
            schemas: {
                AddUserRequestBody: {
                    type: "object",
                    required: ["name", "email", "dob", "isActive"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Nusarat",
                        },
                        email: {
                            type: "string",
                            example: "nusarat@example.com",
                        },
                        dob: {
                            type: "string",
                            format: "date",
                            example: "2002-10-02",
                        },
                        isActive: {
                            type: "boolean",
                            example: true,
                        },
                    },
                },
                
            },
        
        
        },        
    },
    


    apis: ["./src/routes/**/*.ts","./dist/routes/**/*.js"], 
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Function to serve Swagger UI and Docs
function swaggerDocs(app: express.Application, port: number) {
    // Swagger UI documentation page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Swagger JSON format documentation
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;

// import { Express, Request, Response } from "express";
// import express from 'express'
// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";


// const options: any = {
//     definition: {
//         openapi: "3.0.0",
//         info: {
//             title: "WiseOTT Auth Server API Docs",
//             //version: version,
//             description: "WiseOTT Auth Server API Documentation",
//         }
//     },

//     swaggerDefinition: {
//         info: {
//             title: "WiseOTT Auth Server",
//             //version: version,
//             description: "WiseOTT Auth Server API Documentation",
//         },
//         host: "localhost:4000",
//         basePath: "/",
//     },
//     components: {
//         schemas: {
//             CreateChannelInput: {
//                 type: 'object',
//                 required: [
//                     'channelName',
//                     'channelLink',
//                     'genres',
//                     'languages',
//                     'active',
//                     'isFree',
//                     'logoUrl'
//                 ],
//                 properties: {
//                     channelName: {
//                         type: 'string',
//                         default: 'DemoChannel'
//                     },
//                     channelLink: {
//                         type: 'string',
//                         default: 'https://www.example.m3u8'
//                     },
//                     channelLinkUDP: {
//                         type: 'string'
//                     },
//                     channelDescription: {
//                         type: 'string'
//                     },
//                     genres: {
//                         type: 'array',
//                         items: {
//                             type: 'object',
//                             properties: {
//                                 id: {
//                                     type: 'integer'
//                                 }
//                             }
//                         },
//                         default: [
//                             { id: 1 },
//                             { id: 25 }
//                         ]
//                     },
//                     active: {
//                         type: 'boolean',
//                         default: true
//                     },
//                     isFree: {
//                         type: 'boolean',
//                         default: true
//                     },
//                     logoUrl: {
//                         type: 'string',
//                         default: 'https://www.example.com/logo.png'
//                     }
//                 }
//             }
//         }
//     },
//     apis: ["./src/**/*.ts"],
// };

// const swaggerSpec = swaggerJsdoc(options);

// function swaggerDocs(app: express.Application, port: number) {
//     // Swagger Page
//     app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//     // Docs in JSON format
//     app.get("docs.json", (req: Request, res: Response) => {
//         res.setHeader("Content-Type", "application/json");
//         res.send(swaggerSpec);
//     });

//     console.log(`Docs available at http://localhost:${port}/docs`);
// }
// export default swaggerDocs;