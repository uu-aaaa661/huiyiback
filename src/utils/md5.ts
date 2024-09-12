// MD5哈希算法来验证用户输入的密码与数据库中存储的密码是否匹配。MD5是一种广泛使用的哈希算法，
// 可以将密码转换为固定长度的哈希值，以增加安全性

import * as crypto from 'crypto';

export function md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}
