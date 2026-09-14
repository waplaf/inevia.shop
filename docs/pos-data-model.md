# Extensão do core para PVD/POS

O POS é uma extensão futura do domínio de comércio da Inevia.shop, não um produto paralelo. Storefront, CMS e POS partilharão produtos, preços, clientes, pedidos, pagamentos e inventário.

## Fronteiras

- `Store` representa a marca/empresa e continua a ser a fronteira multi-tenant.
- `Location` representa loja física, armazém ou ponto de levantamento.
- `PosTerminal` identifica um caixa/dispositivo dentro de uma localização.
- `CashSession` representa a abertura e o fecho de um terminal por um operador.
- `Order.channel` identifica a origem sem criar uma tabela de vendas concorrente.

## Inventário

`InventoryLevel` guarda o saldo consultável por localização e SKU. `StockMovement` é o razão auditável: cada venda, devolução, reserva, libertação, transferência, dano ou ajuste deve criar um movimento. Actualizar o saldo e inserir o movimento deve acontecer na mesma transacção PostgreSQL.

Enquanto apenas o e-commerce estiver activo, `Product.stock` é o total apresentado pelo storefront e o seed replica-o para o armazém online. Na implementação do POS, `InventoryLevel` torna-se a fonte de verdade e o total do produto passa a ser uma projecção agregada.

## Vendas e pagamentos

Pedidos online não exigem localização, terminal, turno ou operador. Vendas POS preenchem esses campos e só podem apontar para um `CashSession` aberto. Um pedido aceita vários `Payment`, permitindo pagamentos mistos; `amountTendered` e `changeGiven` suportam numerário e `idempotencyKey` protege integrações móveis.

## Auditoria

`CashMovement`, `StockMovement`, `Receipt` e vendas concluídas são registos históricos. Não devem ser apagados nem reescritos por CRUD normal. Correcções devem produzir movimentos inversos, notas de crédito ou devoluções. `Receipt.snapshot` preserva o documento emitido mesmo que dados do catálogo mudem.

## Regras a aplicar na camada de serviço

1. Toda query inclui `storeId`; referências entre entidades devem pertencer à mesma loja.
2. Apenas um turno `OPEN` por terminal (índice parcial PostgreSQL na migration definitiva).
3. Quantidades de devolução nunca excedem as quantidades vendidas.
4. A soma de pagamentos `PAID`, menos reembolsos, nunca excede o total devido.
5. Venda, pagamento confirmado e redução de stock usam transacções e chaves idempotentes.
6. O POS futuro deverá ser online-first; sincronização offline requer uma fila e protocolo próprios.
