delete from public.products;

insert into public.products (id, title, artist, price, image, category, description)
values
  (1, 'REDE PARA GATO', 'Pet Miau', 50.00, 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gatos', 'Rede confortavel para o seu gato descansar.'),
  (2, 'RAMPA INTERATIVA', 'Pet Miau', 75.00, 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gatos', 'Rampa com arranhador para gatos.'),
  (3, 'VARETA DE GATO', 'Pet Miau', 19.90, 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gatos', 'Vareta divertida com penas para estimular seu gato.'),
  (4, 'PA INOX REDE GROSSA', 'Pet Miau', 29.90, 'https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gatos', 'Pa de aco inox para limpeza de caixa de areia.'),
  (5, 'PA INOX REDE FINA', 'Pet Miau', 29.90, 'https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gatos', 'Pa de aco inox com rede fina para limpeza.'),
  (6, 'CATNIP ABACATINHO', 'Pet Miau', 24.90, 'https://images.pexels.com/photos/3628100/pexels-photo-3628100.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gatos', 'Brinquedo formato abacate com catnip interno.');
