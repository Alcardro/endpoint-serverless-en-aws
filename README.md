## 🚀 Todo API - AWS Lambda con TypeScript

## Descripción
API REST serverless para gestión de tareas construida con AWS Lambda, API Gateway y DynamoDB.

## Características
- ✅ Endpoint REST para gestionar tareas
- ✅ Métodos HTTP GET y POST
- ✅ Almacenamiento en DynamoDB
- ✅ Validaciones robustas
- ✅ TypeScript para type safety
- ✅ Infrastructure as Code con AWS SAM

## URL de Producción   Endpoint serverless en AWS

https://1su2hnyt12.execute-api.us-east-1.amazonaws.com/prod/todos


## Arquitectura
- **API Gateway**: Endpoint REST /todos
- **Lambda**: Procesamiento de requests
- **DynamoDB**: Almacenamiento persistente
- **IAM**: Gestión de permisos seguros

## Patrones de Diseño
- **Separación de responsabilidades**: Handlers, Services, Models
- **Inyección de dependencias**: DynamoClient inyectado en TodoService

## Decisiones Técnicas
1. **TypeScript**: Type safety y mejor desarrollo
2. **AWS**: Infrastructure en aws
3. **DynamoDB**: Escalabilidad automática
4. **Lambda Proxy Integration**: Simplificación de requests



**Ejecuta esto para confirmar:**
```bash
# Verificar que responde
curl -I https://1su2hnyt12.execute-api.us-east-1.amazonaws.com/prod/todos

# Probar funcionalidad completa
curl https://1su2hnyt12.execute-api.us-east-1.amazonaws.com/prod/todos


Funcion Lambda
----------------
Mencionar que en la ruta de la funcion lambda "src/todo-apis.js"
