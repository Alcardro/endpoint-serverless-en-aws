// AWS SDK ya viene incluido en Lambda - NO necesitas incluirlo en el ZIP
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TODO_TABLE_NAME || 'tec-practicantes-todo';

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        const method = event.httpMethod;
        const path = event.resource;
        
        // Manejar preflight CORS
        if (method === 'OPTIONS') {
            return { statusCode: 200, headers, body: '' };
        }
        
        if (method === 'GET' && path === '/todos') {
            return await handleGetTodos();
        }
        
        if (method === 'POST' && path === '/todos') {
            return await handleCreateTodo(event);
        }
        
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: `Método ${method} no permitido` })
        };
        
    } catch (error) {
        console.error('Error:', error);
        
        if (error.message && (error.message.includes('titulo') || error.message.includes('requerido'))) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: error.message })
            };
        }
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Error interno del servidor' })
        };
    }
};

async function handleGetTodos() {
    try {
        const params = { TableName: TABLE_NAME };
        const result = await dynamoDb.scan(params).promise();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                todos: result.Items || [],
                count: result.Count || 0
            })
        };
    } catch (error) {
        console.error('Error getting todos:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Error al obtener las tareas' })
        };
    }
}

async function handleCreateTodo(event) {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'El cuerpo de la solicitud es requerido' })
            };
        }
        
        const body = JSON.parse(event.body);
        
        // Validaciones
        if (!body.titulo || typeof body.titulo !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'El campo "titulo" es requerido y debe ser una cadena de texto' })
            };
        }
        
        if (body.titulo.trim().length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'El campo "titulo" no puede estar vacío' })
            };
        }
        
        const newTodo = {
            id: uuidv4(),
            titulo: body.titulo.trim(),
            completada: body.completada || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const params = {
            TableName: TABLE_NAME,
            Item: newTodo
        };
        
        await dynamoDb.put(params).promise();
        
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ 
                message: 'Tarea creada exitosamente',
                todo: newTodo 
            })
        };
        
    } catch (error) {
        console.error('Error creating todo:', error);
        
        if (error instanceof SyntaxError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'JSON inválido en el cuerpo de la solicitud' })
            };
        }
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Error al crear la tarea' })
        };
    }
}