// external modules
const inquirer = require("inquirer");
const chalk = require("chalk");

// internal modules
const fs = require("fs");

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "operation",
        message: "Oque gostaria de fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["operation"];

      if (action === "Criar Conta") {
        createAccountMessage();
      } else if (action === "Consultar Saldo") {
        consultBalance();
      } else if (action === "Depositar") {
        deposit();
      } else if (action === "Sacar") {
        withdraw();
      } else if (action === "Sair") {
        console.log(chalk.bgGreen.black("Até a próxima!"));
      }
    }
    )
    .catch((err) => console.log(err));
}

// create account

function createAccountMessage() {
  console.log(chalk.bgGreen.black("parabéns por escolher nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));

  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da sua conta:",
      },
    ])
    .then((answer) => {
       const account = answer["accountName"];
       
       console.info(account);

       if(!fs.existsSync('accounts')) {
           fs.mkdirSync('accounts');
       }

       if(fs.existsSync(`accounts/${account}.json`)) {
           console.log(chalk.bgRed.black(`Conta >${account} já existe, tente novamente!`));
           buildAccount();
           return
       } else { 
           fs.writeFileSync(`accounts/${account}.json`, JSON.stringify({balance: 0}));
           console.log(chalk.green(`Conta >${account} foi criada com sucesso!`));
           operation();
       }

    })
    .catch((err) => console.log(err));
}

// consult balance

function consultBalance() {
    inquirer
        .prompt([
        {
            name: "accountName",
            message: "Digite o nome da sua conta:",
        },
        ])
        .then((answer) => {
        const account = answer["accountName"];
    
        const accountPath = `accounts/${account}.json`;
    
        if (!fs.existsSync(accountPath)) {
            console.log(chalk.bgRed.black("Conta não encontrada, tente novamente!"));
            operation();
            return;
        }
    
        const accountData = fs.readFileSync(accountPath);
    
        const accountBalance = JSON.parse(accountData);
    
        console.log(chalk.green(`Saldo da conta >${account}: ${accountBalance.balance}`));
    
        operation();
        })
        .catch((err) => console.log(err));
}

// deposit

function deposit() {
    inquirer
        .prompt([
        {
            name: "accountName",
            message: "Digite o nome da sua conta:",
        },
        {
            name: "value",
            message: "Digite o valor a ser depositado:",
            type: "number",
        },
        ])
        .then((answer) => {
        const account = answer["accountName"];
        const depositValue = answer["value"];
        
    
        const accountPath = `accounts/${account}.json`;
    
        if (!fs.existsSync(accountPath)) {
            console.log(chalk.bgRed.black("Conta não encontrada, tente novamente!"));
            operation();
            return;
        }
    
        const accountData = fs.readFileSync(accountPath);
    
        const accountBalance = JSON.parse(accountData);
    
        accountBalance.balance += depositValue;
    
        fs.writeFileSync(accountPath, JSON.stringify(accountBalance));
    
        console.log(chalk.green(`Depósito realizado com sucesso!`));
    
        operation();
        })
        .catch((err) => console.log(err));
}

// withdraw

function withdraw() {
    inquirer
        .prompt([
        {
            name: "accountName",
            message: "Digite o nome da sua conta:",
        },
        {
            name: "value",
            message: "Digite o valor a ser sacado:",
            type: "number",
        },
        ])
        .then((answer) => {
        const account = answer["accountName"];
        const value = answer["value"];
        
    
        const accountPath = `accounts/${account}.json`;
    
        if (!fs.existsSync(accountPath)) {
            console.log(chalk.bgRed.black("Conta não encontrada, tente novamente!"));
            operation();
            return;
        }
    
        const accountData = fs.readFileSync(accountPath);
    
        const accountBalance = JSON.parse(accountData);
    
        if (accountBalance.balance < value) {
            console.log(chalk.bgRed.black("Saldo insuficiente, tente novamente!"));
            operation();
            return;
        }
    
        accountBalance.balance -= value;
    
        fs.writeFileSync(accountPath, JSON.stringify(accountBalance));
    
        console.log(chalk.green(`Saque realizado com sucesso!`));
    
        operation();
        })
        .catch((err) => console.log(err));
}