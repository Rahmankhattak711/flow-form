import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import {
  type CreateUserWithEmailAndPasswordInput,
  createUserWithEmailAndPasswordInput,
  generateUserTokenPayload,
  GenerateUserTokenType,
  signInUserWithEmailAndPasswordInput,
  SignInUserWithEmailAndPasswordInputType,
} from "./model";
import { createHmac, randomBytes } from "node:crypto";
import * as jwt from "jsonwebtoken";
import { env } from "../env";

class UserService {
  public async generateUserToken(payload: GenerateUserTokenType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);
    const token = jwt.sign({ id }, env.JWT_SECRET, { expiresIn: "1d" });
    return { token };
  }

  public async getUserByEmail(email: string) {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
    const firstUser = user[0];
    if (!firstUser) return null;
    return firstUser;
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInput) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUserByEmail = await this.getUserByEmail(email);
    if (existingUserByEmail) throw new Error(`User with email ${email} already exists`);

    const salt = randomBytes(16).toString("hex");
    const hashPassword = createHmac("sha256", salt).update(password).digest("hex");

    const insertUser = await db
      .insert(usersTable)
      .values({
        email,
        fullName,
        password: hashPassword,
        salt,
      })
      .returning({ id: usersTable.id });

    if (!insertUser || insertUser.length === 0 || !insertUser[0]?.id)
      throw new Error("Failed to create user");

    const userId = insertUser[0]?.id;
    if (!userId) throw new Error("Failed to create user");

    const { token } = await this.generateUserToken({ id: userId });

    return {
      id: userId,
      token,
    };
  }

  public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordInputType) {
    const { email, password } = await signInUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);
    if (!existingUser) throw new Error(`User with email ${email} not found`);

    if (!existingUser.password || !existingUser.salt) throw new Error(`Invalid auth method`);

    const hashPassword = createHmac("sha256", existingUser.salt).update(password).digest("hex");

    if (hashPassword !== existingUser.password) throw new Error("Invalid password");

    const { token } = await this.generateUserToken({ id: existingUser.id });
    return { id: existingUser.id, token };
  }

  public async verifyToken(token: string): Promise<GenerateUserTokenType> {
    try {
      const verifyToken = jwt.verify(token, env.JWT_SECRET) as GenerateUserTokenType;
      return verifyToken;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  public async getUserById(id: string) {
    const user = await db
      .select({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
        profileImageUrl: usersTable.profileImageUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    const firstUser = user[0];
    if (!firstUser) throw new Error(`User with id ${id} not found`);
    return firstUser;
  }

  public async verifyAndDecodeUserToken(token: string) {
    const { id } = await this.verifyToken(token);
    return { id };
  }
}

export default UserService;
