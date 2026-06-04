import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class FruitCatchGame extends JPanel implements ActionListener, KeyListener {

    int basketX = 180;
    int basketWidth = 100;

    int fruitX = (int)(Math.random() * 370);
    int fruitY = 0;

    int score = 0;
    int lives = 3;

    Timer timer = new Timer(20, this);

    public FruitCatchGame() {
        setPreferredSize(new Dimension(500, 600));
        setBackground(Color.CYAN);

        addKeyListener(this);
        setFocusable(true);

        timer.start();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        // 籃子
        g.setColor(new Color(139, 69, 19));
        g.fillRect(basketX, 540, basketWidth, 20);

        // 水果
        g.setColor(Color.RED);
        g.fillOval(fruitX, fruitY, 30, 30);

        // 分數
        g.setColor(Color.BLACK);
        g.setFont(new Font("Arial", Font.BOLD, 20));
        g.drawString("Score: " + score, 20, 30);
        g.drawString("Lives: " + lives, 20, 60);
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        fruitY += 3;

        // 接到水果
        if (fruitY + 30 >= 540 &&
            fruitX + 15 >= basketX &&
            fruitX <= basketX + basketWidth) {

            score++;

            fruitX = (int)(Math.random() * 470);
            fruitY = 0;

            // 每10分加速
            if (score % 10 == 0) {
                timer.setDelay(Math.max(5, timer.getDelay() - 2));
            }
        }

        // 漏接
        if (fruitY > 600) {
            lives--;

            fruitX = (int)(Math.random() * 470);
            fruitY = 0;

            if (lives <= 0) {
                timer.stop();

                JOptionPane.showMessageDialog(
                    this,
                    "遊戲結束！\n分數：" + score
                );

                System.exit(0);
            }
        }

        repaint();
    }

    @Override
    public void keyPressed(KeyEvent e) {

        if (e.getKeyCode() == KeyEvent.VK_LEFT) {
            basketX -= 20;
        }

        if (e.getKeyCode() == KeyEvent.VK_RIGHT) {
            basketX += 20;
        }

        if (basketX < 0) {
            basketX = 0;
        }

        if (basketX > 500 - basketWidth) {
            basketX = 500 - basketWidth;
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {}

    @Override
    public void keyTyped(KeyEvent e) {}

    public static void main(String[] args) {

        JFrame frame = new JFrame("接水果遊戲");

        FruitCatchGame game = new FruitCatchGame();

        frame.add(game);
        frame.pack();

        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }
}