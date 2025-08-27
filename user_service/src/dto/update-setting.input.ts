import { IsOptional } from "class-validator";

export class UpdateSettingInput {
  @IsOptional()
  language?: string;

  @IsOptional()
  darkMode?: string;
}
