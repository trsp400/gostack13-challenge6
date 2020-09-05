import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance = transactions.reduce(
      (previous, current) => {
        switch (current.type) {
          case 'income':
            previous.income += Number(current.value);
            break;
          case 'outcome':
            previous.outcome += Number(current.value);
            break;
          default:
            break;
        }

        return previous;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const { income, outcome } = balance;
    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
