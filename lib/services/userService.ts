import { prisma } from '../prisma'
import { User, RegisterData, PublicUser } from '../schemas'
import bcrypt from 'bcryptjs'

export class UserService {
  // Criar usuário
  static async createUser(userData: RegisterData): Promise<PublicUser> {
    try {
      // Verificar se email já existe
      const existingUser = await this.findByEmail(userData.email)
      if (existingUser) {
        throw new Error('Email já está em uso')
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // Criar usuário no banco
      const user = await prisma.user.create({
        data: {
          nome: userData.name,
          email: userData.email,
          senha: hashedPassword,
          tipo: 'PESSOA_FISICA'
        }
      })

      // Retornar usuário sem a senha
      const { senha, ...userWithoutPassword } = user
      return userWithoutPassword as PublicUser
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      throw error
    }
  }

  // Buscar usuário por email
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      })

      return user
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error)
      return null
    }
  }

  // Buscar usuário por ID
  static async findById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      })

      return user
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error)
      return null
    }
  }

  // Verificar senha
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (error) {
      console.error('Erro ao verificar senha:', error)
      return false
    }
  }

  // Atualizar usuário
  static async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updateData
      })

      return user
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    }
  }

  // Deletar usuário
  static async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id }
      })

      return true
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      return false
    }
  }

  // Listar usuários (com paginação)
  static async listUsers(page: number = 1, size: number = 10): Promise<{ users: PublicUser[], total: number }> {
    try {
      const skip = (page - 1) * size

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: size,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            nome: true,
            email: true,
            tipo: true,
            perfilInvestidor: true,
            createdAt: true,
            updatedAt: true
          }
        }),
        prisma.user.count()
      ])

      return { users, total }
    } catch (error) {
      console.error('Erro ao listar usuários:', error)
      throw error
    }
  }

  // Buscar usuário com perfil completo
  static async findUserWithProfile(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
          investments: true,
          expenseCategories: true
        }
      })
    } catch (error) {
      console.error('Erro ao buscar usuário com perfil:', error)
      return null
    }
  }
}
