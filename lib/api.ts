import { NextResponse } from 'next/server'
import { ZodSchema } from 'zod'

/**
 * Retorna uma resposta de sucesso padronizada para a API.
 * @param data - Os dados a serem enviados na resposta.
 * @param status - O código de status HTTP (padrão 200).
 */
export function apiSuccess(data: any, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

/**
 * Retorna uma resposta de erro padronizada para a API.
 * @param message - A mensagem de erro.
 * @param status - O código de status HTTP.
 */
export function apiError(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status })
}

/**
 * Valida o corpo da requisição com um schema Zod.
 * @param request - O objeto de requisição.
 * @param schema - O schema Zod para validação.
 * @returns Um objeto com `data` (se sucesso) ou `error` (se falha).
 */
export async function validateRequestBody<T>(request: Request, schema: ZodSchema<T>): Promise<{ data?: T; error?: NextResponse }> {
  try {
    const body = await request.json();
    const validatedFields = schema.safeParse(body);

    if (!validatedFields.success) {
      return { error: NextResponse.json({ success: false, message: 'Dados inválidos.', errors: validatedFields.error.flatten().fieldErrors }, { status: 400 }) };
    }
    
    return { data: validatedFields.data };
  } catch (error) {
    return { error: apiError('Formato de requisição inválido.', 400) };
  }
} 