import type { Profile } from './ProfileProvider';

type Input = Pick<
  Profile,
  'firstName' | 'lastName' | 'email' | 'birthDate' | 'gender'
>;

function joinFa(list: string[]) {
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join('، ')} و ${list[list.length - 1]}`;
}

/** درصد تکمیل پروفایل و متن راهنما؛ پنج مورد با وزن مساوی */
export function profileCompletion(p: Input, hasPhone: boolean) {
  const items = [
    {
      label: 'نام و نام خانوادگی',
      done: !!p.firstName.trim() && !!p.lastName.trim(),
    },
    { label: 'شماره موبایل', done: hasPhone },
    { label: 'ایمیل', done: !!p.email.trim() },
    { label: 'تاریخ تولد', done: !!p.birthDate },
    { label: 'جنسیت', done: !!p.gender },
  ];

  const done = items.filter(i => i.done).length;
  const missing = items.filter(i => !i.done).map(i => i.label);

  return {
    percent: Math.round((done / items.length) * 100),
    hint: missing.length
      ? `با ثبت ${joinFa(missing)}، پروفایل شما کامل می‌شود.`
      : 'پروفایل شما کامل است.',
  };
}
