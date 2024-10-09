import { Controller, Get, Render, Post, Res, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { DataDto } from './DataDto.dto';
import { Response } from 'express';
import { writeFileSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('dataForm')
  @Render('dataForm')
  getDataForm() { 
    return {
      data: {},
      errors: []
    }
  }

  @Post('dataForm')
  postData(@Body() dataDto: DataDto, @Res() response: Response){
    let errors = []

    if(!dataDto.card || !dataDto.name){
      errors.push("Minden mezőt ki kell tölteni!")
    }
    if(!/[A-z]/.test(dataDto.name)){
      errors.push("A névnek minimum egy nem szóköz jellegű karakter tartalmaznia kell!")
    }
    if(!/^\d{8}-\d{8}$/.test(dataDto.card) && !/^\d{8}-\d{8}-\d{8}$/.test(dataDto.card)){
      errors.push("A kártyaszám helyes formátuma: XXXXXXX-XXXXXXXX / XXXXXXX-XXXXXXXX-XXXXXXXX")
    }
    if(dataDto.contr != "on"){
      errors.push("A szerződési feltételek elfogadása kötlező!")
    }

    if(errors.length > 0){
      response.render('dataForm', {
        data: dataDto,
        errors
      })
      return;
    }

    writeFileSync("data.csv", `${dataDto.name};${dataDto.card}\n`, {
      flag: "a"
     })

    response.redirect('/settingSuccess')

  }

  @Get('settingSuccess')
  getSettingSuccess() {
    return "Sikeres beállítás!"
  }
}
